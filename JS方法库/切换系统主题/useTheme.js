import {ref, watchEffect} from 'vue';

const KEY = '__THEME__'; //将theme进行数据持久化，存入localStorage
const theme = ref(localStorage.getItem(KEY) || 'light');

watchEffect(() => {
	// document.documentElement拿到 <html> 元素本身（DOM 树的根节点）;
	// .setAttribute('data-theme', theme.value)给 <html> 加一个自定义属性
    document.documentElement.setAttribute('data-theme', theme.value);

    localStorage.setItem(KEY, theme.value); // 数据持久化
})

/**切换主题hook*/
export function useTheme() {
    function toggleTheme() {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
    };

    return { theme, toggleTheme};
}