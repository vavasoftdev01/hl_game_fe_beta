function DataTableNoData() {
    return <>
        <div className="flex flex-col h-full w-full gap-1 justify-center items-center"> {/* Added justify-center and items-center here */}
            <div className=" w-1/4 p-1 mt-10 flex justify-center items-center rounded-lg"> {/* Added flex, justify-center, items-center, p-4, rounded-lg */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-20 text-slate-600 drop-shadow-xl ">
                    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                    <path fillRule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.133 2.845a.75.75 0 0 1 1.06 0l1.72 1.72 1.72-1.72a.75.75 0 1 1 1.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 1 1-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 1 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
            </div>
            <div className=" w-1/4 text-center font-bold text-slate-500 rounded-lg text-lg capitalize "> {/* Added p-4, text-center, font-bold, text-red-700, rounded-lg */}
                no data available
            </div>
        </div>
    </>
}

export default DataTableNoData;