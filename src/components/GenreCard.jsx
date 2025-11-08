import './GenreCard.css'
import ForwardButton from "../image/forward_button.png";
import PlayButton from "../image/play_button.png";
import BackwardButton from "../image/backward_button.png";


export default function GenreCard({ title, image, onClick }) {
    return (
        <div className='genre-card' onClick={onClick}>
            <img src={image} alt={title} className='genre-image' />
            <p className='genre-title'>{title}</p>


            <div className='play-bar'>
                <div className='now-play'></div>
                <div className='now-play-circle'></div>
                <div className='whole-bar'></div>
            </div>
            <div className='mp3-icon'>
                <img src={BackwardButton} alt="backward button" className='backward-button' />
                <img src={PlayButton} alt="play button" className='play-button' />
                <img src={ForwardButton} alt="forward button" className='forward-button' />
            </div>
        </div>
    );
}