import {useRouter} from '@tanstack/react-router';
import {CustomButton} from '@/frontend/ui/custom-button';

export function LoginButton() {
  const {session} = useRouter().options.context;
  if (session.data) {
    return (
      <div>
        {session.data.email}{' '}
        <CustomButton onPress={() => session.logout()}>Sign out</CustomButton>
      </div>
    );
  }
  return <CustomButton onPress={() => session.login()}>Sign in</CustomButton>;
}
