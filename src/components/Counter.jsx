import React from 'react'
import { useState, useEffect} from 'react'

export default function Counter({target, started}) {

    const [count, setCount] = useState(0.0);

    const decimals = (String(target).split('.')[1] || '').length
    const numericTarget = parseFloat(target)

    useEffect(()=>{
        if (!started){
            setCount(0)
            return
        }

        const duration = 800;
        const interval = 16;
        const steps = duration/interval;
        const increment = numericTarget/steps;

        let current = 0
        const timer = setInterval(() => {
            current += increment
            if (current >= numericTarget){
                setCount(numericTarget);
                clearInterval(timer);
            } else {
                setCount(current)
            }
        }, interval)

        return () => clearInterval(timer)
    }, [started, numericTarget])


    return <span className="impact-num">{count.toFixed(decimals)}</span>
}
