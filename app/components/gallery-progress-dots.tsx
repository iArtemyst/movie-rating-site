'use client'

export function GalleryProgressDots({selectedIndex}: {selectedIndex:number}) {
    function CircleIcon({index}:{index:number}) {
        return (
            <div className={`${index == selectedIndex ? "galleryIconSelected" : index < selectedIndex ? "galleryIconInactive" : "galleryIconDefault"}`} />
        )
    }

    function MapCircleIconsAmount({count}:{count:number}) {
        let iconArray = [];
        for (let i = 0; i < count; i++ ) {
            iconArray.push(<CircleIcon index={i} key={i}/>);
        }
        return iconArray;
    }

    return (
        <div className="galleryIconsDiv">
            <MapCircleIconsAmount count={3} />
        </div>
    )
}