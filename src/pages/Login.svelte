<script lang="ts">
  import router from 'page';

  import Button from 'src/lib/common/Button.svelte';
  import api from 'src/services/api';
  import { store } from 'src/stores';
  import { ToastController } from 'src/utils/toast';

  let username: string;
  let password: string;

  $: isInvalid = !username || !password;

  function handleLogin(e: Event) {
    if (isInvalid) return;
    api.auth
      .login(username, password)
      .then((user) => {
        store.user.user.set(user);
        router.redirect('/');
      })
      .catch(() => {
        ToastController.danger('เข้าสู่ระบบไม่สำเร็จ', '');
      });
  }
</script>

<section id="login" class="h-full w-full overflow-auto bg-gray-100">
  <div class="mx-auto my-20 w-[550px] rounded-xl bg-white px-14 py-12 shadow">
    <form action="#" novalidate on:submit|preventDefault={handleLogin}>
      <div class="mb-2 text-center text-xl font-bold">ยินดีต้อนรับสู่ร้าน Tpearl</div>
      <div class="mb-10 text-center text-gray-900">กรุณาเข้าสู่ระบบก่อนใช้งาน</div>
      <div class="mb-6">
        <label for="username" class="mb-2 block font-medium text-gray-900">ชื่อผู้ใช้งาน</label>
        <input
          type="text"
          id="username"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="ชื่อผู้ใช้งาน"
          required
          autocomplete="username"
          bind:value={username}
        />
      </div>
      <div class="mb-10">
        <label for="password" class="mb-2 block font-medium text-gray-900">รหัสผ่าน</label>
        <input
          type="password"
          id="current-password"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="รหัสผ่าน"
          required
          autocomplete="current-password"
          bind:value={password}
        />
      </div>
      <Button
        type="submit"
        class="{isInvalid
          ? 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-300'
          : 'bg-blue-600 hover:bg-blue-800 focus:ring-blue-300'} w-full font-medium text-white focus:outline-none focus:ring-4"
        disabled={isInvalid}
      >
        เข้าสู่ระบบ
      </Button>
    </form>
  </div>
</section>
