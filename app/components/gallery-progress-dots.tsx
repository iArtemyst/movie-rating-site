export function GalleryProgressDots({index1, index2, index3, selectedIndex}: {index1:number, index2:number, index3:number, selectedIndex:number}) {
    function CircleIcon({index}:{index:number}) {
        const circleSize = "w-[16px] h-[16px]"
        return (
        <div className={`${index == selectedIndex ? `scale-[125%] bg-[#00ff73]` : index < selectedIndex ? "bg-[#8a8a8a]" : "scale-[100%] bg-[#FAFAFA]"} ${circleSize} rounded-full mt-[12px]`} />
        )
    }

    return (
        <div className="w-fit h-fit flex flex-row self-center gap-[1em] z-[-5]">
        <CircleIcon index={index1}/>
        <CircleIcon index={index2}/>
        <CircleIcon index={index3}/>
        </div>
    )
}