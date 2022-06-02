import { Button } from '@material-ui/core';
import React, { memo, Suspense, useCallback, useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import { initBridgeForm } from '../../features/data/actions/scenarios';
import { isFulfilled } from '../../features/data/reducers/data-loader';
import { bridgeModalActions } from '../../features/data/reducers/wallet/bridge-modal';
import { selectIsWalletKnown, selectWalletAddress } from '../../features/data/selectors/wallet';
import { BeefyState } from '../../redux-types';
import { BridgeModal } from './BridgeModal';

export const Bridge = memo(function _Bridge({ buttonClassname }: { buttonClassname: string }) {
  const { t } = useTranslation();
  const walletAddress = useSelector((state: BeefyState) =>
    selectIsWalletKnown(state) ? selectWalletAddress(state) : null
  );

  const [openBridgeModal, setOpenBridgeModal] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setOpenBridgeModal(false);
  }, []);

  const handleOpen = useCallback(() => {
    setOpenBridgeModal(true);
  }, []);

  const isFormDataLoaded = useSelector((state: BeefyState) =>
    isFulfilled(state.ui.dataLoader.global.bridgeForm)
  );

  const store = useStore();
  useEffect(() => {
    //Init from on mount
    initBridgeForm(store, walletAddress);

    return () => {
      store.dispatch(bridgeModalActions.resetForm());
    };
  }, [store, walletAddress]);

  return (
    <Suspense fallback={<ButtonLoader />}>
      {isFormDataLoaded ? (
        <>
          <Button className={buttonClassname} onClick={handleOpen} size="small">
            {t('Transact-Bridge')}
          </Button>
          <BridgeModal open={openBridgeModal} handleClose={handleClose} />
        </>
      ) : (
        <Button className={buttonClassname} size="small" disabled={true}>
          <ButtonLoader />
        </Button>
      )}
    </Suspense>
  );
});

export const ButtonLoader = ({ backgroundColor = '#313759', foregroundColor = '#8585A6' }) => {
  return (
    <ContentLoader
      width={64}
      height={16}
      viewBox="0 0 64 16"
      backgroundColor="#313759"
      foregroundColor="'#8585A6'"
    >
      <rect x="0" y="0" width="64" height="16" />
    </ContentLoader>
  );
};
