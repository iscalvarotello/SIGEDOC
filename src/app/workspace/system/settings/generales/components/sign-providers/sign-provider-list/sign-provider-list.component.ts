import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignProvider } from '../../../interfaces/sign-provider.interface';
import { IconComponent } from '@system-shared/common/icon/icon.component';
import { SpinnerComponent } from '@system-shared/ui/spinner/spinner.component';
import { SelectableCardComponent } from '@system-shared/ui/selectable-card/selectable-card.component';
import { EmptyStateComponent } from '@system-shared/ui/empty-state/empty-state.component';
import { ListHeaderComponent } from '@system-shared/ui/list-header/list-header.component';
import { ActionButtonComponent } from '@system-shared/buttons/action-button/action-button.component';

@Component({
  selector: 'app-sign-provider-list',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, SelectableCardComponent, EmptyStateComponent, ListHeaderComponent, ActionButtonComponent],
  templateUrl: './sign-provider-list.component.html',
  host: {
    'class': 'flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm'
  }
})
export class SignProviderListComponent {
  providers = input<SignProvider[]>([]);
  selectedProviderId = input<string | null>(null);
  isLoading = input<boolean>(false);

  selectProvider = output<SignProvider | null>();
  createNewProvider = output<void>();
}
