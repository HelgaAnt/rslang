/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import './audioCall.scss';
import { AudioCallStart } from './audioCallStart';
import { AudioCallGame } from './audioCallGame';
import { AudioCallResult } from './audioCallResult';
import { gameProgress } from './constants';
import { groupCount, pageCount } from '../../../constants/globalConstants';

// TODO Не реализовано (этот текст впоследствии обязательно удалю):
// * переводы слов, из которых выбирается нужный, относятся к одной части речи
//      и имеют схожее написание
// * по умолчанию в мини-играх задействованы выученные пользователем слова.
//      Если таких слов недостаточно, игра запускается с первого раунда первого уровня
// * игра передаёт статистику в основную часть приложения
// * ведётся долгосрочная статистика мини-игр, можно посмотреть когда и сколько раз в какую
//      мини-игру играли и с каким результатом. Для хранения статистики используется бекэнд
// Доп функционал:
// * выбор игры с пользовательскими или всеми словами (если слов пользователя хватает)
// * настройка количкества слов в раунде
// * настройка стартового и финишного цвета фона
export class AudioCall extends Component {
    constructor() {
        super();
        this.state = { state: gameProgress.start };
    }

    startGame(repository, group, page) {
        this.setState({
            state: gameProgress.game,
            group,
            page,
            repository,
        });
    }

    endGame(result) {
        this.setState({
            state: gameProgress.result,
            repository: undefined,
            gameResult: result,
        });
    }

    nextGame() {
        let { group, page } = this.state;
        page += 1;
        if (page >= pageCount) {
            page = 0;
            group += 1;
            if (group >= groupCount) {
                page = 0;
                group = 0;
            }
        }
        this.setState({
            state: gameProgress.start,
            page,
            group,
            repository: undefined,
            gameResult: undefined,
        });
    }

    render() {
        switch (this.state.state) {
        case gameProgress.start:
            return (
                <AudioCallStart
                    repository={this.state.repository}
                    modeIsUserWords={false}
                    startGame={(repository, group, page) => this.startGame(repository, group, page)}
                    page={this.state.page}
                    group={this.state.group}
                />
            );
        case gameProgress.game:
            return (
                <AudioCallGame
                    repository={this.state.repository}
                    endGame={(result) => this.endGame(result)}
                />
            );
        case gameProgress.result:
        default:
            return (
                <AudioCallResult
                    gameResult={this.state.gameResult}
                    nextGame={() => this.nextGame()}
                />
            );
        }
    }
}
