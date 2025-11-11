export function ScoreGraph({visible}:{visible:boolean}) {
    return (
        <>
        { visible &&
        <div className={`absolute left-0 top-0 bottom-0 right-0 bg-[#00000011] z-10 flex justify-center flex-col`}>
            <div className="bg-purple-700 w-[720px] h-[480px] text-white py-[2em] px-[2em] rounded-[24px] self-center flex flex-col gap-[1em]">
            <div className={`w-full h-full place-self-center bg-white rounded-[12px] flex`}>
                <p className="text-black place-self-center w-full text-center">This is where i would put my chart, if i had one</p>
            </div>
            <p className="font-bold text-balance text-[24px] text-center place-self-center justify-self-end">Today's Scores</p>
            </div>
        </div>
        }
        </>
    )
}