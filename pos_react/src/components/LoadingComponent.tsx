function LoadingComponent() {
    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-black/40 z-50'>
            <div className="w-full h-full flex gap-3 items-center justify-center">
                <div className="bg-white w-4 h-16 rounded animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="bg-white w-4 h-16 rounded animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                <div className="bg-white w-4 h-16 rounded animate-bounce" style={{ animationDelay: '0.6s' }}></div>
            </div>
        </div>
    )
}

export default LoadingComponent