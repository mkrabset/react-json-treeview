import "./TreeView.css"
import {useEffect, useState} from "react";

function TreeView(props: any) {
    const createModel = (name: string, value: any): object => {
        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                return {
                    name,
                    value: `array[${value.length}]`,
                    children: value.map((v, i) => createModel(`${i}`, v)),
                    primitive: false,
                    isOpen: true
                }
            } else {
                return {
                    name,
                    value: 'object',
                    children: Object.keys(value).map(key => createModel(key, value[key])),
                    primitive: false,
                    isOpen: true
                }
            }
        } else {
            return {
                name,
                value,
                children: [],
                primitive: true,
                isOpen: true
            }
        }
    }

    const toggleOpen = (obj:any)=> {
        obj.isOpen = !obj.isOpen
        const newModel={...model}
        setModel(newModel)
    }

    const createHandle = (obj: any, isLast: boolean) => {
        const hasChildren = obj.children.length > 0
        return (hasChildren)
            ? <div className={obj.isOpen ? 'minushandle' : 'plushandle'}></div>
            : <div className={isLast ? 'end' : 'branch'}></div>
    }

    const createHandleContainer = (obj: any, isLast: boolean) => {
        return <div className="handlecontainer" onClick={()=>toggleOpen(obj)}>
            <div className="vline"></div>
            {createHandle(obj, isLast)}
            <div className={isLast ? 'vspace' : 'vline'}></div>
        </div>
    }

    const createLine = (context: string[], isLast: boolean, obj: any) => {
        const intro = context.map(symbol => {
            switch (symbol) {
                case '|': {
                    return <div className="vline"></div>
                }
                default: {
                    return <div className="spacer"></div>
                }
            }
        })

        const handleContainer = createHandleContainer(obj, isLast)

        const valueClass = obj.primitive ? 'value' : 'typeinfo'
        const textNode = <div className="text">
            <div>{obj.name}: <span className={valueClass}>{obj.value}</span></div>
        </div>
        return <div className={"line"}>{[...intro, handleContainer, textNode]}</div>
    }

    const createLines = (context: string[], obj: any, isLast: boolean) => {
        const objLine = createLine(context, isLast, obj)
        if (!obj.isOpen) {
            return [objLine]
        }

        const contextSymbol = isLast ? ' ' : '|'
        const childLines = obj.children
            .map((child: any, ind: number) => createLines([...context, contextSymbol, ' '], child, ind === obj.children.length - 1))
            .reduce((a: any, b: any) => [...a, ...b], [])
        return [objLine, ...childLines]
    }

    const [model, setModel] = useState(createModel('root', props.json))

    useEffect(() => {
        setModel(createModel('root', props.json))
    }, [props.json])

    const setOpen = (isOpen:boolean, root:any) => {
        root.isOpen=isOpen
        root.children.forEach((c:any)=>setOpen(isOpen, c))
    }

    const expandAll = ()=> {
        setOpen(true, model)
        setModel({...model})
    }
    const collapseAll = ()=> {
        setOpen(false, model)
        setModel({...model})
    }

    return <div className={"treeview"}>
        <div>
            <button onClick={expandAll}>EXPAND ALL</button>
            <button onClick={collapseAll}>COLLAPSE ALL</button>
        </div>
        {createLines([], model, true)}
    </div>


}


export default TreeView