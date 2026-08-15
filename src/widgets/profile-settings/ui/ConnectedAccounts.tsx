import { GitHubIcon, GoogleIcon } from '@/shared/ui';
import { LinkProviderButton } from '@/features/user-profile';

type Provider = 'google' | 'github';

type ConnectedAccountsProps = Record<Provider, boolean>;

const PROVIDERS: Array<{ id: Provider; name: string; icon: typeof GoogleIcon }> = [
  { id: 'google', name: 'Google', icon: GoogleIcon },
  { id: 'github', name: 'GitHub', icon: GitHubIcon },
];

export function ConnectedAccounts({ google, github }: ConnectedAccountsProps) {
  const connected: Record<Provider, boolean> = { google, github };

  return (
    <div className="space-y-3 p-5 sm:p-7">
      {PROVIDERS.map(({ id, name, icon: Icon }) => {
        const isConnected = connected[id];

        return (
          <div
            key={id}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3.5 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-md border bg-background shadow-sm">
                <Icon className="size-4" />
              </span>

              <div>
                <p className="text-xs font-medium">{name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {isConnected ? 'Подключено' : 'Не подключено'}
                </p>
              </div>
            </div>

            <LinkProviderButton provider={id} isLinked={isConnected} providerName={name} />
          </div>
        );
      })}
    </div>
  );
}