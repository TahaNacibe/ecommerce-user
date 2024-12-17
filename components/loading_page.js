import Image from "next/image";

export default function LoadingWidget() {
    return (
        <div className="flex flex-col gap-2 items-center justify-items-center">
            <Image width={300} height={300} src='loading.svg' alt='' />
            <h3>
                Something is about to happen ...
            </h3>
        </div>
    )
}