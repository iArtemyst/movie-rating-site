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
                    <div className="w-fit flex flex-col gap-[1em]">
                        <p className="">Thanks for playing my Daily Movie Rating Site!</p>
                        <div className="flex flex-col gap-[.125em] text-[10px] md:text-[14px]">
                            <div className="w-full flex flex-col self-center place-content-center mb-[.5em]">
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
                                <div className="w-full flex flex-row self-center place-content-center gap-[.25em]">
                                    <p>Streaming Services provided by </p>
                                    <Link href="https://www.justwatch.com/" rel="noopener noreferrer" target="_blank">
                                        <p className="font-bold">JustWatch</p>
                                    </Link>
                                </div>
                            </div>
                            <div className="w-full flex flex-col self-center place-content-center mb-[.5em]">
                                <p className="">Rotten Tomatoes scores are based on the Critic Scores</p>
                                <p className="">Metacritic scores are based on the Metascore</p>
                            </div>
                            <p className="mt-[.5em] text-[10px]">WhatIsItRated.com has no affiliation with any of these companies.</p>
                        </div>
                        <Link href="https://eevee-feywild.com/" rel="noopener noreferrer" target="_blank">
                            <p className="text-balance text-[10px] opacity-50">Created and designed by iArtemyst, please see my portfolio for more of my work!</p>
                        </Link>
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
            <div className="siteFooterDiv">
                <p className="place-self-center" onClick={(() => FooterOnClick())}>Daily Movie Rating © 2026 | Designed by iArtemyst</p>
            </div>
            <ShowAboutDiv/>
        </>
        )
}