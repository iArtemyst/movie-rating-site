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
                <div className="flex flex-col gap-[1em] place-items-center w-full h-fit">
                    <div className="footerAboutDiv">
                        <div className="w-fit flex flex-col text-[10px] md:text-[14px]">
                            <p className="">Thanks for playing my Daily Movie Rating Site!</p>
                            <div className="w-full flex flex-row self-center place-content-center gap-[.25em]">
                                <p>Data obtained from</p>
                                <Link href="https://www.omdbapi.com/" rel="noopener noreferrer" target="_blank">
                                    <p className="font-bold">OMDB</p>
                                </Link>
                                <p> and </p>
                                <Link href="https://www.themoviedb.org/?language=en-US" rel="noopener noreferrer" target="_blank">
                                    <p className="font-bold">TMDB</p>
                                </Link>
                            </div>
                            <p className="">Rotten Tomatoes scores are based on the Critic Scores</p>
                            <p className="">Metacritic scores are based on the Metascore</p>
                            <p className="mt-[.5em] text-[.65em] opacity-50">WhatIsItRated.com has no affiliation with any of these companies.</p>
                        </div>
                        <p className="hideMeText">click anywhere to close</p>
                    </div>

                    <div className="w-fit h-fit px-[1em] py-[.5em] bg-[#ae00ff9d] rounded-[1em] hover:scale-90 hover:cursor-pointer">
                        <Link href="https://github.com/iartemyst" rel="noopener noreferrer" target="_blank">
                            <p className="text-balance text-[10px]">Created by @iArtemyst</p>
                        </Link>
                    </div>
                </div>
            </div>
            }
        </>
        )
    }

    return (
        <>
            <div className="siteFooterDiv">
                <p className="place-self-center" onClick={(() => FooterOnClick())}>Daily Movie Rating © 2026 | Designed by iArtemyst</p>
            </div>
            <ShowAboutDiv/>
        </>
        )
}