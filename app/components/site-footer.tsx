'use client'

import React, { useState } from "react";
import Link from "next/link";

export function SiteFooter() {
const [visible, setVisible] = useState(false)

function FooterOnClick() {
    setVisible(true)
}

function ShowAboutDiv() {
    return (
    <>
        {
        visible &&
        <div className="fullScreenBlockingDiv" onClick={() => setVisible(false)}>
            <div className="footerAboutDiv">
                <div className="w-fit flex flex-col place-items-center">
                <p className="my-[.5em] font-semibold mb-[1em]">Thanks for playing my Daily Movie Rating Site!</p>
                <div className="w-fit flex flex-col place-items-center text-[16px]">
                    <div className="w-fit flex flex-row gap-[.375em]">
                    <p>Data obtained from</p>
                        <Link href="https://www.omdbapi.com/" rel="noopener noreferrer" target="_blank">
                        <p className="font-bold">OMDB</p>
                        </Link>
                    </div>
                    <div className="w-fit flex flex-row gap-[.375em]">
                    <p>Most recent update:</p>
                    <p>December 2025</p>
                    </div>
                </div>
                </div>
                <div className="w-fit flex flex-col place-items-center text-[16px] mb-[1em]">
                <div className="w-fit flex flex-row gap-[.25em]">
                    <p>Designed by</p>
                    <Link href="https://github.com/iartemyst" rel="noopener noreferrer" target="_blank">
                        <p className="font-bold">iArtemyst,</p>
                    </Link>
                    <p> with special thanks to </p>
                    {/* <Link href="https://github.com/asundheim" rel="noopener noreferrer" target="_blank">
                        <p className="font-bold">Ders</p>
                    </Link> */}
                    <p className="font-bold">Ders</p>
                    <p>for support</p>
                </div>
                <div className="w-fit flex flex-row gap-[.375em]">
                    <p>Please check out my</p>
                    <Link href="https://eevee-feywild.com/" rel="noopener noreferrer" target="_blank">
                        <p className="font-bold">portfolio</p>
                    </Link>
                    <p>for more of my work</p>
                </div>
                </div>
                <p className="hideMeText">click anywhere to close</p>
            </div>
        </div>
        }
    </>
    )
}

return (
    <>
        <div className="siteFooterDiv" onClick={(() => FooterOnClick())}>
        <p>Daily Movie Rating © 2025 | Designed by iArtemyst</p>
        </div>
        <ShowAboutDiv/>
    </>
    )
}