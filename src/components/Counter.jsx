import React from 'react'
import { useState, useEffect, useRef} from 'react'

export default function Counter({target}) {

    const [count, setCount] = useState(0.0);
    const [started, setStarted] = useState(false)
    const ref = useRef(null)

    useEffect(()=>{
        if (!started) return;
        const duration = 1500;
        const interval = 16;
        const steps = duration/interval;
        const increment = target/steps;

        let current = 0
        const timer = setInterval(() => {
            current = current + (target - current) * 0.08
            setCount(Math.ceil(current))
            if (target - current < 0.5){
                setCount(target);
                clearInterval(timer);
            } 
        }, interval)
    
    if (!started){
        setCount(0)
        return
    }
    return () => clearInterval(timer)
    }, [started, target])

    useEffect(()=>{
        const observer = new IntersectionObserver(
            ([entry]) =>{
                setStarted(entry.isIntersecting)
            },
            {threshold: 0.12, rootMargin: '0px 0px -8% 0px'}
        )
            observer.observe(ref.current)
            return () => observer.disconnect()
        }, [])

    return <span className="impact-num" ref={ref}>{count}</span>
}
