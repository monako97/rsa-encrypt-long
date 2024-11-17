import { For } from 'solid-js';
import docs from '@app/docs';
import { mdStyle, theme } from 'neko-ui';

import Footer from '@/components/footer';

import ChangeLog from '../CHANGELOG.md';

import Home from './home';

import './layout.global.css';

import 'neko-ui/es/provider';

function App() {
  const { isDark } = theme;

  function onScheme() {
    document.documentElement.setAttribute('data-theme', isDark() ? 'dark' : 'light');
  }
  return (
    <n-provider onScheme={onScheme}>
      <style textContent={mdStyle} />
      <main class="site-doc-main">
        <div class="site-page-view">
          <div class="n-md-box">
            <div class="n-md-body">
              <Home />
            </div>
          </div>
          <For each={docs['']}>{(e) => e()}</For>
          <div class="n-md-box">
            <div class="n-md-body">
              <ChangeLog />
            </div>
          </div>
        </div>
        <Footer />
      </main>
      <n-back-top css=".back-top {position: fixed;}" />
      <div class="n-site-bg" />
    </n-provider>
  );
}

export default App;
