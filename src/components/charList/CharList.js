import { useState, useEffect, useRef } from 'react';
import MarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types';

import loadingGear from '../spinner/loading-gear.gif';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {

  const [charsArray, setCharsArray] = useState ([])
  const [loading, setLoading] = useState (true)
  const [error404, setError404] = useState (false)
  const [loadingMore, setLoadingMore] = useState (false) // отвечает за отключение фукнции кнопки Load more
  const [offset, setOffset] = useState (210) // id по загрузке новых персонажей
  const [charEnded, setCharEnded] = useState (false) // проверка на конечность списка персонажей

  const marvelService = new MarvelService();

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener ('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (loadingMore && !charEnded) {
    setOffset (offset => offset + 9)
    console.log (offset)
    loadMoreRequest(offset);
    }
  }, [loadingMore]);

  const onScroll = (event) => {
    if (
      window.innerHeight + window.pageYOffset >= document.body.offsetHeight
    ) {
        setLoadingMore(true);
    }
  };

  const loadMoreRequest = (offset) => { // подгрузка 9 персонажей на страницу
    onCharListLoading();
    marvelService.getAllCharacters(offset)
      .then(onCharLoaded) // вызываем метод для 1 char и передаем его в метод onCharLoaded
      .catch(onError404);
  }

  const onCharListLoading = () => {
      setLoadingMore(true);
  }

  const onCharLoaded = (newCharsArray) => {
    // просто перезаписываем state как только данные загрузились, меняем статус загрузки и ошибки
    let ended = false;
    if (newCharsArray.length < 9) {
       ended = true;
    }

    setCharsArray (charsArray => [...charsArray, ...newCharsArray]);
    setLoading (false);
    setLoadingMore (false);
    setOffset (offset => offset + 9);
    setCharEnded (ended);
  }

  const onError404 = () => {
    setLoading (false);
    setError404(true)
  }

  const itemRefs = useRef ([]);

  const focusOnItem = (key) => {
    itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
    itemRefs.current[key].classList.add('char__item_selected');
    itemRefs.current[key].focus();
  }

  function preRenderChars (arr) {
    const items = arr.map((item, i) => {
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
          ref={el => itemRefs.current[i] = el} // формируем список рефов на каждой итерации
          key={key}
          onClick={()=>{props.onCharSelected(key);} // передаем id в компонент App.js
        }
        onKeyPress={(e) => {
          if (e.key === "Enter") {
              props.onCharSelected(key);
              focusOnItem(i)
          }
      }}>
          <img src={thumbnail} alt={name} style={isImageFound} />
          <div className="char__name">{name}</div>
        </li>
      );
    });

    return <ul className="char__grid">{items}</ul>;
  };

    const items = preRenderChars(charsArray);

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
                onClick={()=> loadMoreRequest(offset)}>
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired
}

export default CharList;
