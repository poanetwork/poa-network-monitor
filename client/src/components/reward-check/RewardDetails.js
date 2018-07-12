import React from "react";

function RewardDetails(props) {
    return (
        <div>
            <div>expectedReward: {props.rewardDetails.expectedReward}</div>
            <div>actualReward: {props.rewardDetails.actualReward}</div>
            <div>block: {props.rewardDetails.block}</div>
            <div>gasUsed: {props.rewardDetails.gasUsed}</div>
            <div>txsNumber: {props.rewardDetails.txsNumber}</div>
            <div>basicReward: {props.rewardDetails.basicReward}</div>
            <div>validator: {props.rewardDetails.validator}</div>
        </div>
    );
}

export default RewardDetails;