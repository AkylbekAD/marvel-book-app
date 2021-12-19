import { Component } from 'react';
import MarvelService from '../../services/MarvelService';

import loadingGear from '../spinner/loading-gear.gif';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
  state = {
    charsArray: [],
    loading: true, 
    error404: false,
  };

  marvelService = new MarvelService();

  updateChars = () => {
    this.marvelService
      .getAllCharacters()
      .then(this.onCharLoaded) // вызываем метод для 1 char и передаем его в метод onCharLoaded
      .catch(this.onError404); //
  };

  componentDidMount() {
    this.updateChars();
  }

  onError404 = () => {
    this.setState({
      loading: false, 
      error404: true 
  });
  }

  onCharLoaded = (charsArray) => {
    // просто перезаписываем state как только данные загрузились, меняем статус загрузки и ошибки
    this.setState({
        charsArray,
        loading: false,
    });
  };

  preRenderChars (arr) {
    const items = arr.map((item) => {
      let { id, name, thumbnail, wiki,} = item;
      let isImageFound = {'objectFit': 'cover'};

      if (
        // проверка на отсутствующее изображение
        thumbnail ===
        'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
      ) {
        isImageFound = {
          'objectFit': 'unset', // вписывание изображения об отсутствии
        };
      }

      return (
        <li className="char__item" key={id}>
          <img src={thumbnail} alt={name} style={isImageFound} />
          <div className="char__name">{name}</div>
          <a href={wiki} target="_blank" rel=" noreferrer" style={{'color': '#ffffff'}}>wiki</a>
        </li>
      );
    });

    return <ul className="char__grid">{items}</ul>;
  };

  render() {
    const { charsArray, loading, error404 } = this.state;

    const items = this.preRenderChars(charsArray);

    const errorMessage = error404 ? <ErrorMessage/> : null;
    const spinner = loading ? <img src={loadingGear} alt="loading..." className="center" /> : null;
    const content = !(loading || error404) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner} 
        {content}
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
