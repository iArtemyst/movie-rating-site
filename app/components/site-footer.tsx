'use client'

import React, { useState } from "react";
import Link from "next/link";
import { IPlayerStats } from "./player-stats";
import { SwitchThemeButton } from "../components/theme-switch-button";

export function SiteFooter({playerStats}:{playerStats:IPlayerStats}) {
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

                        <div className="">
                            <Link href="https://www.omdbapi.com/" rel="noopener noreferrer" target="_blank">
                                <p>Data obtained from OMDB. Most recent update: December 2025.</p>
                            </Link>
                            <p className="text-[.875em]">Rotten Tomato scores are based on the Critic Scores</p>
                            <p className="text-[.875em]">Metacritic scores are based on the Metascore</p>
                        </div>

                        <Link href="https://eevee-feywild.com/" rel="noopener noreferrer" target="_blank">
                            <p className="text-balance">Created and designed by iArtemyst, please see my portfolio for more of my work!</p>
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
                <p className="place-self-center" onClick={(() => FooterOnClick())}>Daily Movie Rating © 2025 | Designed by iArtemyst</p>
                <SwitchThemeButton playerStats={playerStats}/>
            </div>
            <ShowAboutDiv/>
        </>
        )
}