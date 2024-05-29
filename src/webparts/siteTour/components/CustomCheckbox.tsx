import * as React from 'react';
import { useState, useEffect } from 'react';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import styles from './SiteTour.module.scss';

export interface CustomCheckboxProps {
    checked: boolean | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (event: any, isChecked: any) => void;
    label: string;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    checked,
    onChange,
    label
}) => {

    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const handleChange = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean): void => {
        setIsChecked(isChecked);
        onChange?.(ev, isChecked);
    };

    return <Checkbox label={label} checked={isChecked} onChange={handleChange} className={styles.chkBox} />;
}
