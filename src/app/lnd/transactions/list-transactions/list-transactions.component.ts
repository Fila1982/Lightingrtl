import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { MatTableDataSource, MatSort } from '@angular/material';
import { Transaction } from '../../../shared/models/lndModels';
import { LoggerService } from '../../../shared/services/logger.service';

import { RTLEffects } from '../../../store/rtl.effects';
import * as RTLActions from '../../../store/rtl.actions';
import * as fromRTLReducer from '../../../store/rtl.reducers';

@Component({
  selector: 'rtl-list-transactions',
  templateUrl: './list-transactions.component.html',
  styleUrls: ['./list-transactions.component.scss']
})
export class ListTransactionsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public displayedColumns = [];
  public listTransactions: any;
  public flgLoading: Array<Boolean | 'error'> = [true];
  public flgSticky = false;
  private unsub: Array<Subject<void>> = [new Subject(), new Subject(), new Subject()];

  constructor(private logger: LoggerService, private store: Store<fromRTLReducer.RTLState>, private rtlEffects: RTLEffects, private actions$: Actions) {
    switch (true) {
      case (window.innerWidth <= 415):
        this.displayedColumns = ['dest_addresses', 'total_fees', 'amount'];
        break;
      case (window.innerWidth > 415 && window.innerWidth <= 730):
        this.displayedColumns = ['dest_addresses', 'time_stamp', 'total_fees', 'amount'];
        break;
      case (window.innerWidth > 730 && window.innerWidth <= 1024):
        this.displayedColumns = ['dest_addresses', 'time_stamp', 'num_confirmations', 'total_fees', 'tx_hash', 'amount'];
        break;
      case (window.innerWidth > 1024 && window.innerWidth <= 1280):
        this.flgSticky = true;
        this.displayedColumns = ['dest_addresses', 'time_stamp', 'num_confirmations', 'total_fees', 'tx_hash', 'amount'];
        break;
      default:
        this.flgSticky = true;
        this.displayedColumns = ['dest_addresses', 'time_stamp', 'num_confirmations', 'total_fees', 'block_hash', 'block_height', 'tx_hash', 'amount'];
        break;
    }
  }

  ngOnInit() {
    this.store.dispatch(new RTLActions.FetchTransactions());
    this.actions$.pipe(takeUntil(this.unsub[2]), filter((action) => action.type === RTLActions.RESET_LND_STORE)).subscribe((resetLndStore: RTLActions.ResetLNDStore) => {
      this.store.dispatch(new RTLActions.FetchTransactions());
    });

    this.store.select('lnd')
    .pipe(takeUntil(this.unsub[0]))
    .subscribe((rtlStore) => {
      rtlStore.effectErrorsLnd.forEach(effectsErr => {
        if (effectsErr.action === 'FetchTransactions') {
          this.flgLoading[0] = 'error';
        }
      });
      if (undefined !== rtlStore.transactions) {
        this.loadTransactionsTable(rtlStore.transactions);
      }
      if (this.flgLoading[0] !== 'error') {
        this.flgLoading[0] = (undefined !== rtlStore.transactions) ? false : true;
      }
      this.logger.info(rtlStore);
    });

  }

  applyFilter(selFilter: string) {
    this.listTransactions.filter = selFilter;
  }

  onTransactionClick(selRow: Transaction, event: any) {
    const flgExpansionClicked = event.target.className.includes('mat-expansion-panel-header') || event.target.className.includes('mat-expansion-indicator');
    if (flgExpansionClicked) {
      return;
    }
    const selTransaction = this.listTransactions.data.filter(transaction => {
      return transaction.tx_hash === selRow.tx_hash;
    })[0];
    const reorderedTransactions = JSON.parse(JSON.stringify(selTransaction, [
      'dest_addresses', 'time_stamp_str', 'num_confirmations', 'total_fees', 'block_hash', 'block_height', 'tx_hash', 'amount'
    ] , 2));
    this.store.dispatch(new RTLActions.OpenAlert({ width: '75%', data: {
      type: 'INFO',
      message: JSON.stringify(reorderedTransactions)
    }}));
  }

  loadTransactionsTable(transactions) {
    this.listTransactions = new MatTableDataSource<Transaction>([...transactions]);
    this.listTransactions.sort = this.sort;
    this.listTransactions.data.forEach(transaction => {
      if (undefined !== transaction.time_stamp_str) {
        transaction.time_stamp_str = (transaction.time_stamp_str === '') ? '' : formatDate(transaction.time_stamp_str, 'MMM/dd/yy HH:mm:ss', 'en-US');
      }
    });
    this.logger.info(this.listTransactions);
  }

  resetData() {
  }

  ngOnDestroy() {
    this.unsub.forEach(completeSub => {
      completeSub.next();
      completeSub.complete();
    });
  }

}
