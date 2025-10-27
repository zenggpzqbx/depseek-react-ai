import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {setTheme} from "@/store/themeSlice";

export default function AppInit() {
    const dispatch = useDispatch();

    function handleThemeChange(e) {
        dispatch(setTheme("auto"));
    }

    useEffect(() => {
        dispatch(setTheme("light"));
        const media = window.matchMedia("(prefers-color-scheme: dark)")
        media.addEventListener('change', handleThemeChange)

        return () => {
            media.removeEventListener('change', handleThemeChange)
        }

    }, [])

    return (
        <></>
    )
}
