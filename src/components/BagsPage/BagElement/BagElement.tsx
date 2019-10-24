import './BagElement.scss';

import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import Card from '../../Card';
import { BagData, BagsInfo } from '../BagsPage';

const BagElement = ({ bag }: { bag: BagData }) => {
  const { updateBag } = BagsInfo.useContainer();

  const onChangeBrandName = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateBag({ ...bag, brandName: event.target.value });
  };

  const onChangeNameOfModel = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateBag({ ...bag, nameOfModel: event.target.value });
  };

  const onChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateBag({ ...bag, price: parseInt(event.target.value, 10) });
  };

  return (
    <Card>
      <div className="bagElement">
        <div className="left">
          <LazyLoadImage
            src={`data/bags/${bag.id}`}
            // visibleByDefault
          />
        </div>
        <div className="right">
          <label className="id" placeholder="id">
            {bag.id}
          </label>
          <input
            className="brandName"
            placeholder="Brand name"
            value={bag.brandName}
            onChange={onChangeBrandName}
          />
          <input
            className="modelName"
            placeholder="Model name"
            value={bag.nameOfModel}
            onChange={onChangeNameOfModel}
          />
          <input
            type="number"
            className="price"
            placeholder="Price"
            value={bag.price}
            onChange={onChangePrice}
          />
        </div>
      </div>
    </Card>
  );
};

export default BagElement;
