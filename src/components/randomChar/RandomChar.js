import { useState, useEffect } from 'react';
import loadingGear from '../spinner/loading-gear.gif';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {

  const [char, setChar] = useState({});

  const {loading, error404, getOneCharacter, clearError} = useMarvelService();

  useEffect(() => {
    updateChar();
    const timerId = setInterval(updateChar, 60000);

    return () => {
        clearInterval(timerId)
    }
  }, [])

  const onCharLoaded = (char) => {
    // просто перезаписываем state как только данные загрузились, меняем статус загрузки и ошибки
    setChar (char);
  };

  const updateChar = () => {
    clearError(); // очистка ошибки
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

    getOneCharacter(id)
      .then(onCharLoaded) // вызываем метод для 1 char и передаем его в метод onCharLoaded
  };

    const errorMessage = error404 ? <ErrorMessage /> : null;
    const spinner = loading ? (
      <img src={loadingGear} alt="loading..." className="center" />
    ) : null;
    const content = !(loading || error404) ? <View char={char} /> : null;

    return (
      <div className="randomchar">
        {errorMessage}
        {spinner}
        {content}
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">Or choose another one</p>
          <button onClick={updateChar} className="button button__main">
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;

  let isImageFound = {
    objectFit: 'cover',
  };

  if (
    thumbnail ===
    'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
  ) {
    isImageFound = {
      'objectFit': 'contain',
    };
  }

  return (
    <div className="randomchar__block">
      <img
        src={thumbnail}
        alt="Random character"
        className="randomchar__img"
        style={isImageFound}
      />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{description}</p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
