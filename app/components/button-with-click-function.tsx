export function ButtonWithClickHandler({buttonText, buttonStyle = "", onClickFunction}:{buttonText:string, buttonStyle?:string, onClickFunction:()=>void}) {
    return (
    <button onClick={() => onClickFunction} className={`${buttonStyle? `${buttonStyle}` : "bg-blue-700 w-fit h-fit py-[.5em] px-[1em] rounded-full hover:scale-[95%] active:scale-[90%] self-center mt-[1em]"} `}>
        {buttonText}
    </button>
    )
}