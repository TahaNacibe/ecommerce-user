

export default function CostumeButton({ bgColor, text, onClickAction, icon }) {
    return (
        <div
            onClick={() => onClickAction()}
            className={`rounded-3xl px-4 items-center flex py-2 gap-2 text-white border cursor-pointer ${bgColor} ${bgColor == "bg-transparent"? "border-white" : "border-transparent"}`}>
            {icon}
            <h3 className="text-lg">
                {text}
            </h3>
        </div>
    )
}