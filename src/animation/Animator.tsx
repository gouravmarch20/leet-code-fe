
import { DotLottieReact } from "@lottiefiles/dotlottie-react";


interface AnimatiorProp {
    type: "success"| "fail",
    setshowAnimation: (arg:boolean)=>void;
}

const Animator = ({type , setshowAnimation}:AnimatiorProp) => {
    console.log("animation activated")
    function onComplete(){
        console.log("completed")
        setshowAnimation(false)
    }

    const path = {success:"/src/animation/Confetti.json" , fail:"/src/animation/Error.json"}
    return (
        <DotLottieReact
            src={type==="success"?path.success:path.fail}
            autoplay
            dotLottieRefCallback={(dotLottie) => {
                dotLottie?.addEventListener('complete',onComplete)
            }}
            className="absolute top-1/4 left-24 z-10"
        />
    );
};


export default Animator