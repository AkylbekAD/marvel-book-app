import { useState, useEffect } from 'react';
import loadingGear from '../spinner/loading-gear.gif';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import useMarvelService from '../../services/MarvelService';

import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {loading, error404, getOneCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    // componentDidCatch(err, info) {
    //     console.log(err, info);
    //     this.setState({error404:true});
    // }

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {return}

        clearError();
        getOneCharacter(charId)
            .then(onCharLoaded)
    }
    
    const onCharLoaded = (char) => {
        // просто перезаписываем state как только данные загрузились, меняем статус загрузки и ошибки
        setChar (char);
      }
        
        const skeleton = char || loading || error404 ? null : <Skeleton/>;
        const errorMessage = error404 ? <ErrorMessage /> : null;
        const spinner = loading ? (
          <img src={loadingGear} alt="loading..." className="center" />
        ) : null;
        const content = !(loading || error404 || !char) ? <View char={char} /> : null;

        return (
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage}
                {content}
            </div>
        )
    }

const View = ({char}) => {

    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let isImageFound = {
        objectFit: 'cover',
      };
    
      if (
        // проверка на отсутствующее изображение
        thumbnail ===
        'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
      ) {
        isImageFound = {
          'objectFit': 'contain', // вписывание изображения об отсутствии
        };
      }

    return (
        <>
            <div className="char__basics">
                    <img src={thumbnail} alt={name} style={isImageFound}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length === 0? 'Sorry, there is no comics with this character': null}
                {
                    comics.map((item, i)=> {
                        return(
                            <li key={i} className="char__comics-item">
                            <a href={item.resourceURI}>{item.name}</a>
                            </li>
                        )
                        }
                    )
                }
            </ul>  
        </>
    )
}

export default CharInfo;