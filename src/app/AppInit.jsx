import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {setTheme} from "@/store/slices/themeSlice";

export default function AppInit() {
    const theme = useSelector((state) => state.theme);
    const dispatch = useDispatch();

    function handleThemeChange(e) {
        dispatch(setTheme("auto"));
    }

    useEffect(() => {
        dispatch(setTheme(theme));
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
