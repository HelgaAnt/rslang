import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './study.scss';
import next from '../../../assets/images/next-arrow.png';
import { Button } from '../../shared/button';
import { Answer } from './answer';
import { WordService } from '../../../services/wordServices';
import { SettingService } from '../../../services/settingServices';
import { Spinner } from '../../shared/spinner';
import { Progress } from './progress';

const audioPrefixMap = {
    showWordTranslate: 'audio',
    showSentenceMeaning: 'audioMeaning',
    showSentenceExample: 'audioExample',
};

const contextMap = {
    showWordTranslate: 'word',
    showSentenceMeaning: 'textMeaning',
    showSentenceExample: 'textExample',
};

export class Study extends Component {
    constructor(props) {
        super(props);
        this.state = {
            learnedWordsQuantity: 0,
            needToLearnWordsQuantity: 0,
            totalLearnedWordsQuantity: 0,
            wordCount: 0,
            valueInput: '',
            isCorrectWord: null,
            isLoadSettings: false,
            isLoadWords: false,
            isFirstTry: true,
            showEvaluation: false,
            isSubmitable: true,
            isAudioFinished: false,
            redirected: false,
        };

        this.audioPlayer = new Audio();
    }

    componentDidMount() {
        this.startTraining();
    }

    componentWillUnmount() {

    }

    getSettings = async () => {
        const settings = await SettingService.get();
        this.settings = settings.optional;
        console.log(this.settings);
    }

    getWords = async () => {
        const newWordsQuery = { userWord: null };
        const totalLearnedWordsQuery = { 'userWord.optional.isDeleted': false };
        const todayMidnightDate = new Date(Date.now()).setHours(23, 59, 59, 999);
        const learnedWordsDateLimitedQuery = { $and: [{ 'userWord.optional.isDeleted': false, 'userWord.optional.nextDate': { $lt: todayMidnightDate } }] };

        this.newWordsforTraining = [];
        if (this.settings.newWords) {
            const newWordsQuantity = this.settings.newWords;
            const newWordsAggResponse = await WordService.getUserAggWords(
                '', newWordsQuery, newWordsQuantity,
            );
            this.newWordsforTraining = newWordsAggResponse[0].paginatedResults;
        }
        this.learnedWordsForTraining = [];
        if (this.settings.totalWords - this.settings.newWords > 0) {
            const learnedWordsQuantity = this.settings.totalWords - this.settings.newWords;
            const learnedWordsAggResponse = await WordService.getUserAggWords(
                '', learnedWordsDateLimitedQuery, learnedWordsQuantity,
            );
            this.learnedWordsForTraining = learnedWordsAggResponse[0].paginatedResults;
        }

        this.words = this.newWordsforTraining.concat(this.learnedWordsForTraining);
        console.log(this.words);

        const totalLearnedWordsAggResponse = await WordService.getUserAggWords('', totalLearnedWordsQuery, 1);
        const totalLearnedWords = totalLearnedWordsAggResponse[0].totalCount.length
            ? totalLearnedWordsAggResponse[0].totalCount[0].count
            : 0;
        this.setState({ totalLearnedWordsQuantity: totalLearnedWords });
    }

    startTraining = async () => {
        await this.getSettings();
        await this.getWords();
        if (this.words.length) {
            this.createCard();
            this.setState({
                isLoadWords: true,
                isLoadSettings: true,
                needToLearnWordsQuantity: this.words.length,
            });
        } else {
            alert('no words for training. change your settings');
            this.setState({ redirected: true });
        }
    }

    createCard = () => {
        const { wordCount } = this.state;
        this.actualCard = this.words[wordCount];
        this.context = this.chooseLearnMethod();
        this.audioContext = audioPrefixMap[this.context];
        this.dataForCard = {
            context: this.actualCard[contextMap[this.context]],
            word: this.actualCard.word,
            wordTranslate: this.actualCard.wordTranslate,
            audioContext: `https://raw.githubusercontent.com/aidfromdeagland/rslang-data/master/${this.actualCard[this.audioContext]}`,
            audioWord: `https://raw.githubusercontent.com/aidfromdeagland/rslang-data/master/${this.actualCard.audio}`,
            translationContext: this.actualCard[`${contextMap[this.context]}Translate`],
            idWord: this.actualCard.id,
            wordImage: `https://raw.githubusercontent.com/aidfromdeagland/rslang-data/master/${this.actualCard.image}`,
            transcription: this.actualCard.transcription,
        };
    }

    checkWord = () => {
        const actualValue = this.prevValue.toLocaleLowerCase();
        const studiedWord = this.dataForCard.word;

        const word = studiedWord.split('').map((letter, index) => (
            <span
                className={letter === actualValue[index]
                    ? 'correct-letter check-letter'
                    : 'incorrect-letter check-letter'}
                key={index}
            >
                {letter}
            </span>
        ));
        return word;
    }

    handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }
        const { valueInput } = this.state;
        const actualValue = valueInput.toLocaleLowerCase();

        if (this.state.isSubmitable) {
            if (actualValue === this.dataForCard.word.toLocaleLowerCase()) {
                if (this.state.isFirstTry) {
                    this.setState({ showEvaluation: true });
                    console.log('GOOD TRY');
                } else {
                    this.words.push(this.words[this.state.wordCount]);
                    console.log(this.words);
                }
                this.audioPlayer.src = this.dataForCard.audioContext;
                this.audioPlayer.play();
                this.setState({
                    isCorrectWord: true,
                    isSubmitable: false,
                    isAudioFinished: false,
                });

                this.audioPlayer.addEventListener('ended', () => {
                    if (this.state.showEvaluation === false) {
                        if (this.state.isFirstTry) {
                            this.setState((prev) => ({
                                learnedWordsQuantity: prev.learnedWordsQuantity + 1,
                                totalLearnedWordsQuantity: prev.totalLearnedWordsQuantity + 1,
                            }));
                        }
                        if (this.state.wordCount < this.words.length - 1) {
                            this.setState((prev) => ({
                                wordCount: prev.wordCount + 1,
                            }));
                            this.createCard();
                            this.setState({
                                isCorrectWord: null,
                                valueInput: '',
                                isFirstTry: true,
                                isSubmitable: true,
                            });
                        } else {
                            alert('FINISH! / STATISTICS');
                            this.setState({ redirected: true });
                        }
                    }
                    this.setState({ isAudioFinished: true });
                }, { once: true });
            } else {
                this.audioPlayer.src = this.dataForCard.audioWord;
                this.audioPlayer.play();
                this.prevValue = valueInput;
                this.setState({
                    isCorrectWord: false,
                    valueInput: '',
                    isFirstTry: false,
                });
            }
        }
    }

    handleEvaluate = () => {
        if (this.state.isAudioFinished) {
            if (this.state.wordCount < this.words.length - 1) {
                this.setState((prev) => ({
                    wordCount: prev.wordCount + 1,
                    learnedWordsQuantity: prev.learnedWordsQuantity + 1,
                    totalLearnedWordsQuantity: prev.totalLearnedWordsQuantity + 1,
                }));
                this.createCard();
                this.setState({
                    isCorrectWord: null,
                    valueInput: '',
                    isFirstTry: true,
                    isSubmitable: true,
                });
            } else {
                alert('FINISH / STATISTICS');
                this.setState({ redirected: true });
            }
        }
        this.setState({ showEvaluation: false });
    }

    handleClickToDifficult = () => {
        console.log(this.words[this.state.wordCount]);
    }

    handleChange = (event) => {
        this.setState({
            isCorrectWord: null,
            valueInput: event.target.value,
        });
    }

    handleClickShowAnswer = () => {
        this.setState({
            valueInput: this.dataForCard.word,
            isFirstTry: false,
        });
    }

    chooseLearnMethod = () => {
        const { showWordTranslate, showSentenceMeaning, showSentenceExample } = this.settings;
        const cardRenderVarieties = { showWordTranslate, showSentenceMeaning, showSentenceExample };
        const selectredVariants = Object.keys(cardRenderVarieties)
            .filter((setting) => this.settings[setting] === true);
        const min = 0;
        const max = selectredVariants.length - 1;
        const randomNumb = this.randomInteger(min, max);
        return selectredVariants[randomNumb];
    }

    randomInteger = (min, max) => {
        const rand = min - 0.5 + Math.random() * (max - min + 1);
        if (rand < 0) {
            return 0;
        }
        return Math.round(rand);
    }

    handleClickNext = (e) => {
        this.handleSubmit(e);
    }

    render() {
        const {
            isLoadSettings, isLoadWords, valueInput, isCorrectWord,
            showEvaluation, learnedWordsQuantity, needToLearnWordsQuantity,
            totalLearnedWordsQuantity, redirected,
        } = this.state;
        if (redirected) {
            return <Redirect to="/main" />;
        }
        if (isLoadSettings && isLoadWords) {
            return (
                <div className="study-page">
                    <div className="card-container">
                        <section className="card">
                            <div className="hints-container">
                                <div className="img-container">
                                    {this.settings.showPicture
                                        && <img src={this.dataForCard.wordImage} alt="exampleImg" />}
                                </div>
                                <div className="transcription">
                                    {this.settings.showTranscription
                                        && <span>{this.dataForCard.transcription}</span>}
                                </div>
                                <div className="sentence-translation">
                                    <span>{this.dataForCard.translationContext}</span>
                                </div>
                            </div>
                            <div className="learn-content">
                                <div className="card-input">
                                    <Answer
                                        context={this.dataForCard.context}
                                        word={this.dataForCard.word}
                                        wordAudio={this.dataForCard.audioWord}
                                        contextAudio={this.dataForCard.audioContext}
                                        checkWord={this.checkWord}
                                        handleChange={this.handleChange}
                                        handleSubmit={this.handleSubmit}
                                        valueInput={valueInput}
                                        isCorrectWord={isCorrectWord}
                                        showEvaluation={showEvaluation}
                                        handleEvaluate={this.handleEvaluate}
                                        currentWord={this.words[this.state.wordCount]}
                                    />
                                </div>
                            </div>
                            <div className="buttons-block">
                                <Button className="button delete-btn learn-btn" title="delete" />
                                <Button className="button hard-btn learn-btn" title="difficult" />
                                <Button className="button answer-btn learn-btn" title="Show Answer" onClick={this.handleClickShowAnswer} />
                            </div>
                        </section>
                        <div className="navigate-next">
                            <Button className="btn-next-card" onClick={(e) => this.handleClickNext(e)}>
                                <img src={next} alt="next" />
                            </Button>
                        </div>
                    </div>
                    <Progress
                        learnedWordsQuantity={learnedWordsQuantity}
                        needToLearnWordsQuantity={needToLearnWordsQuantity}
                        totalLearnedWordsQuantity={totalLearnedWordsQuantity}
                    />
                </div>
            );
        }
        return <Spinner />;
    }
}
