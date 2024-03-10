<script setup>
import { ref } from 'vue';

defineProps({
    holder: {
        type: String
    }
})

const searchBar = ref(null);
const searchInput = ref(null);
const searchResults = ref([]);

const onBlur = () => {
    if (!searchInput.value.length) cancelSearch();
};

const onInput = () => {
    if (searchInput.value.length) {
        searchBar.value.classList.add('weui-search-bar_focusing');
        searchResults.value = [{ id: 1, text: '实时搜索文本' }, { id: 2, text: '实时搜索文本' }, { id: 3, text: '实时搜索文本' }, { id: 4, text: '实时搜索文本' }];
    } else {
        hideSearchResult();
    }
};

const clearSearchInput = () => {
    hideSearchResult();
    searchInput.value.focus();
};

const cancelSearch = () => {
    hideSearchResult();
    searchBar.value.classList.remove('weui-search-bar_focusing');
};

const hideSearchResult = () => {
    const searchResult = document.getElementById('searchResult');
    if (searchResult) {
        searchResult.style.display = 'none';
    }
    searchBar.value.classList.remove('weui-search-bar_focusing');
    searchInput.value.value = '';
};

defineExpose({
    onBlur, onInput, clearSearchInput, cancelSearch, hideSearchResult
});
</script>

<template>
    <div class="weui-search-bar" ref="searchBar">
        <form role="combobox" aria-haspopup="true" aria-expanded="false" aria-owns="searchResult"
            class="weui-search-bar__form">
            <div class="weui-search-bar__box">
                <i class="weui-icon-search"></i>
                <input type="search" aria-controls="searchResult" class="weui-search-bar__input" ref="searchInput"
                    placeholder="搜索" required @blur="onBlur" @input="onInput" />
                <a href="javascript:" role="button" title="清除" class="weui-icon-clear" @click="clearSearchInput"></a>
            </div>
            <label for="searchInput" class="weui-search-bar__label">
                <i class="weui-icon-search"></i>
                <span aria-hidden="true">{{ holder ? holder : '搜索' }}</span>
            </label>
        </form>
        <a href="javascript:" role="button" class="weui-search-bar__cancel-btn" @click="cancelSearch">取消</a>
    </div>
    <div role="listbox" class="weui-cells searchbar-result" id="searchResult">
        <div role="option" class="weui-cell weui-cell_active weui-cell_access" v-for="result in searchResults"
            :key="result.id">
            <div class="weui-cell__bd weui-cell_primary">
                <p>{{ result.text }}</p>
            </div>
        </div>
    </div>
</template>