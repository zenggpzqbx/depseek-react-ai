import {Select} from "antd";
import setting from "../setting.module.css"
import {useDispatch, useSelector} from "react-redux";
import {setTheme} from "@/store/themeSlice";

export default function Theme() {
    const theme = useSelector(state => state.theme);
    const dispatch = useDispatch();
    const themeOptions = [
        {value: 'light', label: '亮色'},
        {value: 'dark', label: '暗色'},
        {value: 'auto', label: '跟随系统'},
    ]

    function handleThemeChange(value) {
        dispatch(setTheme(value));
    }

    return (
        <>
            <div className={`${setting.settingItem} flex justify-between items-center`}>
                <div>应用主题</div>
                <Select
                    value={theme}
                    style={{width: 120}}
                    onChange={handleThemeChange}
                    options={themeOptions}
                />
            </div>
        </>
    )
}
