import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types';

import loadingGear from '../spinner/loading-gear.gif';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
  state = {
    charsArray: [],
    loading: true, 
    error404: false,
    loadingMore: false, // отвечает за отключение фукнции кнопки Load more
    offset: 9, // количество загружаемых персонажей
    charEnded: false // проверка на конечность списка персонажей
  };

  marvelService = new MarvelService();

  loadMoreRequest = (offset) => { // подгрузка 9 персонажей на страницу
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharLoaded) // вызываем метод для 1 char и передаем его в метод onCharLoaded
      .catch(this.onError404);
  }

  onCharListLoading = () => {
      this.setState({
        loadingMore: true
      })
  }

  componentDidMount() {
    this.loadMoreRequest();
    window.addEventListener('scroll', this.loadMoreByScroll)
  }

  loadMoreByScroll = () => {
    if (this.state.charEnded) window.removeEventListener('scroll', this.loadMoreByScroll)

    if (!this.state.loading && !this.state.loadingMore) {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
          this.loadMoreRequest(this.state.offset)
        }
     } 
  } 

  onError404 = () => {
    this.setState({
      loading: false, 
      error404: true 
  });
  }

  onCharLoaded = (newCharsArray) => {
    // просто перезаписываем state как только данные загрузились, меняем статус загрузки и ошибки
    let ended = false;
    if (newCharsArray.length < 9) {
       ended = true;
    }
    
    this.setState(({offset, charsArray}) => ({
        charsArray: [...charsArray, ...newCharsArray],
        loading: false,
        loadingMore: false,
        offset: offset + 9,
        charEnded: ended,
    }))
  }

  itemRefs = [];

  setRef = (ref) => {
    this.itemRefs.push(ref);
  }

  focusOnItem = (key) => {
    this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));

    this.itemRefs[key].classList.add('char__item_selected');
    this.itemRefs[key].focus();
    console.log(this.itemRefs)
  }

  preRenderChars (arr) {
    const items = arr.map((item) => {
      let { key, name, thumbnail} = item;
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
        <li 
          className="char__item"
          tabIndex={0}
          key={key}
          onClick={()=>{this.props.onCharSelected(key);} // передаем id в компонент App.js
        }
        onKeyPress={(e) => {
          if (e.key === "Enter") {
              this.props.onCharSelected(key);
          }
      }}>
          <img src={thumbnail} alt={name} style={isImageFound} />
          <div className="char__name">{name}</div>
        </li>
      );
    });

    return <ul className="char__grid">{items}</ul>;
  };

  render() {
    const { charsArray, loading, error404, loadingMore, offset, charEnded} = this.state;

    const items = this.preRenderChars(charsArray);

    const errorMessage = error404 ? <ErrorMessage/> : null;
    const spinner = loading ? <img src={loadingGear} alt="loading..." className="center" /> : null;
    const content = !(loading || error404) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner} 
        {content}
        <button className="button button__main button__long"
                disabled={loadingMore}
                style={{'display': charEnded? 'none': 'block'}}
                onClick={()=> this.loadMoreRequest(offset)}>
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired
}

export default CharList;
