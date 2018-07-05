const assert = require('assert');
const {
    testData
} = require('../test-helper.js');
const {
    missingRoundsCheck
} = require('../missing-rounds.js');

describe('Check missing-rounds test', function () {
    describe('#Check with blocks where some validators are missed, adds validators on some steps, some of them miss round too', async function () {
        let validatorsToAdd = testData.validatorsToAdd;
        let foundMissedValidators = [];
        let blockIndex = 0;
        let currentValidators = testData.validators;
        while (blockIndex <= currentValidators.length) {
            console.log('block index: ' + blockIndex + ", validatorsArray.length: " + currentValidators.length);
            // add new validator if defined in the test data
            let newValidator = validatorsToAdd[blockIndex];
            if (newValidator) {
                currentValidators.push(newValidator);
            }
            let missedFromBlock = await missingRoundsCheck.checkBlock(testData.blocks[blockIndex], currentValidators);
            if (missedFromBlock) {
                for (let v of missedFromBlock) {
                    if (foundMissedValidators.indexOf(v) === -1) {
                        foundMissedValidators.push(v);
                    }
                }
            }
            blockIndex++;
        }
        // check result
        console.log("foundMissedValidators: " + foundMissedValidators);
        let skippedMissedValidators = [];
        for (let missedValidator of testData.missingValidators) {
            if (foundMissedValidators.indexOf(missedValidator) === -1) {
                skippedMissedValidators.push(missedValidator);
            }
        }
        // some of added validators were missed in blocks
        let skippedAddedValidators = [];
        for (let addedMissedValidator of testData.addedMissedValidators) {
            if (addedMissedValidator && foundMissedValidators.indexOf(addedMissedValidator) === -1) {
                skippedAddedValidators.push(addedMissedValidator);
            }
        }
        it('Missed validators from blocks should be found', function () {
            assert.ok(skippedMissedValidators.length === 0, "Didn't find missed validators from blocks: " + skippedMissedValidators);
        });
        it('Added validators who missed round should be found', function () {
            assert.ok(skippedAddedValidators.length === 0, "Didn't find added validators who missed round: " + skippedAddedValidators);
        });
        let foundMissedNumber = foundMissedValidators.length;
        let expectedMissedNumber = testData.missingValidators.length + testData.addedMissedValidators.length;
        it('Number of found missed validators should fit', function () {
            assert.ok(foundMissedNumber === expectedMissedNumber,
                "Wrong number of found missed validators: " + foundMissedNumber + " instead of  " + expectedMissedNumber);
        });
    });
});

describe('Check missing-rounds test', function () {
    describe('#Check with removed validator on some step', async function () {
        it('Test should not detect any missed validator', async function () {
            let blockIndex = 0;
            let missedValidators = [];
            let validators = testData.validators;
            let validatorsWithRemoved = testData.validatorsWithRemoved;
            let blocks = testData.blocksWithRemovedValidator;
            let stepToRemove = testData.stepToRemove;
            while (blockIndex < blocks.length) {
                // simulate validator removing on specified step, use array with removed validator for next checks
                if (blockIndex >= stepToRemove) {
                    validators = validatorsWithRemoved;
                }
                let missedFromBlock = await missingRoundsCheck.checkBlock(blocks[blockIndex], validators);
                if (missedFromBlock) {
                    for (let v of missedFromBlock) {
                        if (missedValidators.indexOf(v) === -1) {
                            missedValidators.push(v);
                        }
                    }
                }
                blockIndex++;
            }
            console.log("missedValidators: " + missedValidators);

            assert.ok(missedValidators.length === 0, "Wrong missedValidators: " + missedValidators);
        });
    });
});

