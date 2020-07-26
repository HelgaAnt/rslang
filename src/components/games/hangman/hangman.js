import React, { Component } from 'react';
import { Button } from '../../shared/button';
import './hangman.scss';
// eslint-disable-next-line import/no-cycle
import { HangmanGame } from './hangmangame';
import { HangmanCustom } from './hangmancustom';

import './hangmanstat.scss';

export class Hangman extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isStart: false,
            level: (localStorage.getItem('hangman_level') === null) ? 0 : localStorage.getItem('hangman_level'),
            page: (localStorage.getItem('hangman_page') === null) ? 0 : localStorage.getItem('hangman_page'),
        };
        this.handleStart = this.handleStart.bind(this);
        this.handleLevel = this.handleLevel.bind(this);
        this.handlePage = this.handlePage.bind(this);
    }

    componentWillUnmount() {
        localStorage.setItem('hangman_level', this.state.level);
        localStorage.setItem('hangman_page', this.state.page);
    }

    handleStart() {
        this.setState({ isStart: true });
    }

    handleLevel(value) {
        this.setState({ level: value });
    }

    handlePage(value) {
        this.setState({ page: value });
    }

    render() {
        if (this.state.isStart) {
            return (
                <HangmanGame
                    level={this.state.level}
                    page={this.state.page}
                />
            );
        }
        return (
            <div className="hangman-start">
                <div className="hangman-start-text">
                    <div>Welcome to the scaffold.</div>
                    <div>Pointing letters, guess the word</div>
                    <div>or go to the gallows!</div>
                </div>
                <div className="hangman-start-custom">
                    <HangmanCustom
                        level={this.state.level}
                        handleLevel={this.handleLevel}
                        page={this.state.page}
                        handlePage={this.handlePage}
                    />
                    <Button
                        className="hangman-start-btn"
                        onClick={this.handleStart}
                        title="Start"
                    />
                </div>

            </div>
        );
    }
}
