import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';

import loadingGear from '../spinner/loading-gear.gif';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = (props) => {

    const [comicsArray, setComicsArray] = useState ([])
    const [loadingMore, setLoadingMore] = useState (false) // отвечает за отключение фукнции кнопки Load more
    const [offset, setOffset] = useState (555) // id по загрузке новых 
    const [comicsEnded, setComicsEnded] = useState (false) // проверка на конечность списка 
  
    const {loading, error404, getAllComics} = useMarvelService();
  
    // useEffect(() => { // первоначальная загрузка
    //   loadMoreRequest(offset)
    // }, []);
  
    useEffect(() => {
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener ('scroll', onScroll);
    }, []);
  
    useEffect(() => {
      if (loadingMore && !comicsEnded || comicsArray.length === 0) {
      setOffset (offset => offset + 8)
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

    const loadMoreRequest = (offset) => { // подгрузка 8 комиксов на страницу
        setLoadingMore(true)
        getAllComics(offset)
          .then(onComicsLoaded) // вызываем метод для 1 comic и передаем его в метод onComicLoaded
      }
    
      const onComicsLoaded = (newComicsArray) => {
        // перезаписываем state как только данные загрузились, меняем статус загрузки и ошибки
        let ended = false;
        if (newComicsArray.length < 1) {
           ended = true;
        }
    
        setComicsArray (comicsArray => [...comicsArray, ...newComicsArray]);
        setLoadingMore (false);
        setOffset (offset => offset + 8);
        setComicsEnded (ended);
      }
      
      function preRenderComics (arr) {
        const items = arr.map((item, i) => {
          let { key, title, thumbnail, price} = item;

          return (
            <li className="comics__item"
                key={i}
                >
                <Link to={`/comics/${key}`}>
                    <img src={thumbnail} alt={title} className="comics__item-img"/>
                    <div className="comics__item-name">{title}</div>
                    <div className="comics__item-price">{price}</div>
                </Link>
            </li>
        );
      })
        return <ul className="comics__grid">{items}</ul>;
    }

    const items = preRenderComics(comicsArray);

    const errorMessage = error404? <ErrorMessage/> : null;
    const spinner = loading && loadingMore ? <img src={loadingGear} alt="loading..." className="center" /> : null;

    return (
        <div className="comics__list">
                {spinner}
                {errorMessage}
                {items}
            <button className="button button__main button__long"
                    disabled={loadingMore}
                    style={{'display' : comicsEnded ? 'none' : 'block'}}
                    onClick={() => loadMoreRequest(offset)}
                    >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;