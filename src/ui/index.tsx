import { createApp, ref } from 'vue'

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
        <h2>Hello Vue3 and Figma</h2>
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
