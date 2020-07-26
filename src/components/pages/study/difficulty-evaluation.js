import React, { Component } from 'react';
import { Button } from '../../shared/button';
import { WordService } from '../../../services/wordServices';
import { getMemoInfo } from '../../../services/spacedRepetition';
import './difficulty-evaluation.scss';

export class DifficultyEvaluation extends Component {
    handleCLick = (difficultyLevel) => {
        const { handleEvaluate, currentWord } = this.props;
        if (currentWord.userWord) {
            const {
                isDeleted, isDifficult, repeats, debutDate,
            } = currentWord.userWord.optional;
            const result = getMemoInfo(difficultyLevel, repeats);

            const defaultWordPutTemplate = {
                optional: {
                    isDeleted,
                    isDifficult,
                    debutDate,
                    prevDate: result.prevRepetitionDate,
                    nextDate: result.nextRepetitionDate,
                    repeats: result.repetitions,
                },
            };

            WordService.putWord(currentWord.id, defaultWordPutTemplate);
        } else {
            const result = getMemoInfo(difficultyLevel);

            const defaultWordPostTemplate = {
                optional: {
                    isDeleted: false,
                    isDifficult: false,
                    debutDate: result.prevRepetitionDate,
                    prevDate: result.prevRepetitionDate,
                    nextDate: result.nextRepetitionDate,
                    repeats: result.repetitions,
                },
            };

            WordService.postWord(currentWord.id, defaultWordPostTemplate);
        }
        setTimeout(() => handleEvaluate(), 0);
    }

    render() {
        const { handleRepeatEvaluate } = this.props;
        return (
            <div className="difficulty-evaluation">
                <Button
                    title="easy"
                    className="difficulty-button difficulty-button_easy"
                    onClick={() => { this.handleCLick(0); }}
                />
                <Button
                    title="normal"
                    className="difficulty-button difficulty-button_normal"
                    onClick={() => { this.handleCLick(1); }}
                />
                <Button
                    title="hard"
                    className="difficulty-button difficulty-button_hard"
                    onClick={() => { this.handleCLick(2); }}
                />
                <Button
                    title="again"
                    className="difficulty-button difficulty-button_again"
                    onClick={handleRepeatEvaluate}
                />
            </div>
        );
    }
}
