import { Component } from 'react';
import loadingGear from '../spinner/loading-gear.gif';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import MarvelService from '../../services/MarvelService';

import './charInfo.scss';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error404: false,
      };

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId){
            this.updateChar();
        }

    }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {return}

        this.onCharLoading();

        this.marvelService
            .getOneCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError404)
    }

    onError404 = () => {
        this.setState({ loading: false, error404: true });
      };
    
      onCharLoading =() => { // показываем спинер до загрузки
        this.setState({loading:true})
      }
    
      onCharLoaded = (char) => {
        // просто перезаписываем state как только данные загрузились, меняем статус загрузки и ошибки
        this.setState({ char, loading: false , error404: false});
      };
    
    render() {

        const {char, loading, error404} = this.state;
        
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