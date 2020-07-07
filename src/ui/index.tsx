import { createApp, ref } from 'vue'
import style from './style.module.css'

createApp({
  setup() {
    const refCount = ref(5)
    function handler() {
      parent.postMessage(
        { pluginMessage: { type: 'create-rectangles', count: refCount.value } },
        '*'
      )
    }

    function cancel() {
      parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
    }

    return () => (
      <div>
        <h2 class={{ [style.foo]: true }}>Byted Motion</h2>
        <p>
          Count: <input id="count" value={refCount.value} />
        </p>
        <button id="create" onClick={handler}>
          Create
        </button>
        <button id="cancel" onClick={cancel}>
          Cancel
        </button>
      </div>
    )
  }
}).mount('#app')
