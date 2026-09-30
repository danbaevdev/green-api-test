import { LoginForm } from '@/features/login'
import styles from './LoginPage.module.css'

export const LoginPage = () => (
  <main className={styles.page}>
    <div className={styles.card}>
      <h1 className={styles.title}>Вход через GREEN-API</h1>
      <LoginForm />
    </div>
  </main>
)
