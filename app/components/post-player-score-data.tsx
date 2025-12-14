
import * as constants from "../constants";
import { IPlayerScoreInfo } from "./player-stats";

export async function PostPlayerScoreData({playerScores, playerOverallScore}:{playerScores:IPlayerScoreInfo[], playerOverallScore:number}) {
    const response = await fetch(constants.hostLink("PlayerScoreInfo"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            movieScores: [
                {
                    "movieIndex": 0,
                    "movieScore": playerScores[0].MovieScore,
                    "movieRating": playerScores[0].MovieRating
                },
                {
                    "movieIndex": 1,
                    "movieScore": playerScores[1].MovieScore,
                    "movieRating": playerScores[1].MovieRating
                },
                {
                    "movieIndex": 2,
                    "movieScore": playerScores[2].MovieScore,
                    "movieRating": playerScores[2].MovieRating
                }
            ],
            overallScore: playerOverallScore
        })
    });

    if (!response.ok) throw new Error('Sending Daily Score Data to Server Failed')
}