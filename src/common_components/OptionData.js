import React from 'react'
const OptionData = {
    yes_no_options: [
        { text: 'Yes', value: '1' },
        { text: 'No', value: '0' }
    ],
    country_options: [{ label: 'India', value: 101 }],
    gst_rate_options: [
        { text: '0%', value: '0' },
        { text: '0.01%', value: '0.01' },
        { text: '0.25%', value: '0.25' },
        { text: '1.5%', value: '1.5' },
        { text: '3%', value: '3' },
        { text: '5%', value: '5' },
        { text: '12%', value: '12' },
        { text: '18%', value: '18' },
        { text: '28%', value: '28' },
        { text: 'Exempted', value: 'Exempted' },
        { text: 'Non GST', value: 'Non GST' }
    ],
    textFilterCondition: [
        { text: 'Contains', value: '1' },
        { text: 'Not contains', value: '2' },
        { text: 'Equals', value: '3' },
        { text: 'Not equal', value: '4' },
        { text: 'Start with', value: '9' },
        { text: 'Ends with', value: '10' },
        { text: 'Is empty', value: '12' }
    ],
    numberFilterCondition: [
        { text: 'Equals', value: '3' },
        { text: 'Not equal', value: '4' },
        { text: 'Less than', value: '5' },
        { text: 'Less than or equals', value: '6' },
        { text: 'Greater than', value: '7' },
        { text: 'Greater than or equals', value: '8' },
        { text: 'In range', value: '11' },
        { text: 'Is empty', value: '12' }
    ],
    organization_option: [
        { text: 'Select organization', value: '' },
        { text: 'Foreign Company', value: '1' },
        { text: 'Foreign Limited Liability Partnership', value: '2' },
        { text: 'Government Department', value: '3' },
        { text: 'Hindu Undivided Family', value: '4' },
        { text: 'Limited Liability Partnership', value: '5' },
        { text: 'Local Authority', value: '6' },
        { text: 'Others', value: '7' },
        { text: 'Partnership', value: '8' },
        { text: 'Private Limited Company', value: '9' },
        { text: 'Proprietorship', value: '10' },
        { text: 'Public Limited Company', value: '11' },
        { text: 'Public Sector Undertaking', value: '12' },
        { text: 'Society/ Club/ Trust/ AOP', value: '13' },
        { text: 'Statutory Body', value: '14' },
        { text: 'Unlimited Company', value: '15' },
        { text: 'Corporation', value: '16' }
    ],
    party_type_options: [
        { text: 'Not Applicable', value: '1' },
        { text: 'Deemed Export', value: '2' },
        { text: 'Embassy/UN Body', value: '3' },
        { text: 'SEZ', value: '4' }
    ],
    dateFilterCondition: [
        { text: 'Equals', value: '3' },
        { text: 'Not equal', value: '4' },
        { text: 'Less than', value: '5' },
        { text: 'Less than or equals', value: '6' },
        { text: 'Greater than', value: '7' },
        { text: 'Greater than or equals', value: '8' },
        { text: 'In range', value: '11' },
        { text: 'Is empty', value: '12' }
    ],
    selectFilterCondition: [
        { text: 'Contains', value: '1' },
        { text: 'Not contains', value: '2' },
        { text: 'Equals', value: '3' },
        { text: 'Not equal', value: '4' },
        { text: 'Is empty', value: '12' }
    ],
    registration_type_options: [
        { text: 'Regular (With GST)', value: '1' },
        { text: 'Composition (With GST)', value: '2' },
        { text: 'Consumer (Without GST)', value: '3' },
        { text: 'Unregistered (Without GST)', value: '4' },
        { text: 'Unknown (Without GST)', value: '5' }
    ],
    statusFilterCondition: [
        { text: 'Contains', value: '1' },
        { text: 'Not contains', value: '2' },
        { text: 'Equals', value: '3' },
        { text: 'Not equal', value: '4' }
    ],
    module_activity_option: [
        { text: 'All', value: '' },
        { text: 'Company', value: '1' }
    ],
    activity_operation_option: [
        { text: 'All', value: '' },
        { text: 'Create', value: '1' },
        { text: 'Update', value: '2' },
        { text: 'Delete', value: '3' },
        { text: 'Cancel', value: '4' },
        { text: 'Upload', value: '5' },
        { text: 'Attach', value: '6' },
        { text: 'Create-attach', value: '7' },
        { text: 'Update-attach', value: '8' },
        { text: 'Remove-attach', value: '9' },
        { text: 'Import', value: '10' },
        { text: 'User', value: '11' },
        { text: 'Permission', value: '12' },
        { text: 'Invitation', value: '13' },
        { text: 'Print', value: '14' },
        { text: 'Active', value: '15' },
        { text: 'Deactive', value: '16' }
    ],
    company_type_options: [
        { text: 'Regular', value: 'Regular' },
        { text: 'Composition', value: 'Composition' }
    ],
    GST_return_history_status: [
        { text: 'Success', value: 'Success' },
        { text: 'Pending', value: 'Pending' }
    ],
    filing_type_options: [
        { text: 'GSTR-1', value: '1' },
        { text: 'GSTR-1 IFF', value: '2' }
    ],
    export_type_option: [
        { text: 'WPAY', value: 'WPAY' },
        { text: 'WOPAY', value: 'WOPAY' }
    ],
    rate_options: [
        { text: '0.00', value: '0.00' },
        { text: '0.10', value: '0.10' },
        { text: '0.25', value: '0.25' },
        { text: '1.00', value: '1.00' },
        { text: '1.50', value: '1.50' },
        { text: '3.00', value: '3.00' },
        { text: '5.00', value: '5.00' },
        { text: '6.00', value: '6.00' },
        { text: '7.50', value: '7.50' },
        { text: '12.00', value: '12.00' },
        { text: '18.00', value: '18.00' },
        { text: '28.00', value: '28.00' }
    ],
    supply_type_options: [
        { text: 'Regular B2B', value: 'R' },
        { text: 'SEZ supplies with payment', value: 'SEWP' },
        { text: 'SEZ supplies without payment', value: 'SEWOP' },
        { text: 'Deemed Exp', value: 'DE' },
        { text: 'Intra-State supplies attracting IGST', value: 'CBW' }
    ],
    b2cs_type_options: [
        { text: 'OE', value: 'OE' },
        { text: 'E', value: 'E', disabled: true }
    ],
    exemp_description_option: [
        { text: 'inter-state supplies to registered persons', value: 'INTRB2B' },
        { text: 'intra-state supplies to registered persons', value: 'INTRAB2B' },
        { text: 'inter-state supplies to unregistered persons', value: 'INTRB2C' },
        { text: 'intra-state supplies to unregistered persons', value: 'INTRAB2C' }
    ],
    place_of_supply_options: [
        { value: '01-Jammu & Kashmir', text: '01-Jammu & Kashmir' },
        { value: '02-Himachal Pradesh', text: '02-Himachal Pradesh' },
        { value: '03-Punjab', text: '03-Punjab' },
        { value: '04-Chandigarh', text: '04-Chandigarh' },
        { value: '05-Uttarakhand', text: '05-Uttarakhand' },
        { value: '06-Haryana', text: '06-Haryana' },
        { value: '07-Delhi', text: '07-Delhi' },
        { value: '08-Rajasthan', text: '08-Rajasthan' },
        { value: '09-Uttar Pradesh', text: '09-Uttar Pradesh' },
        { value: '10-Bihar', text: '10-Bihar' },
        { value: '11-Sikkim', text: '11-Sikkim' },
        { value: '12-Arunachal Pradesh', text: '12-Arunachal Pradesh' },
        { value: '13-Nagaland', text: '13-Nagaland' },
        { value: '14-Manipur', text: '14-Manipur' },
        { value: '15-Mizoram', text: '15-Mizoram' },
        { value: '16-Tripura', text: '16-Tripura' },
        { value: '17-Meghalaya', text: '17-Meghalaya' },
        { value: '18-Assam', text: '18-Assam' },
        { value: '19-West Bengal', text: '19-West Bengal' },
        { value: '20-Jharkhand', text: '20-Jharkhand' },
        { value: '21-Odisha', text: '21-Odisha' },
        { value: '22-Chhattisgarh', text: '22-Chhattisgarh' },
        { value: '23-Madhya Pradesh', text: '23-Madhya Pradesh' },
        { value: '24-Gujarat', text: '24-Gujarat' },
        { value: '25-Daman & Diu', text: '25-Daman & Diu' },
        { value: '26-Dadra & Nagar Haveli & Daman & Diu', text: '26-Dadra & Nagar Haveli & Daman & Diu' },
        { value: '27-Maharashtra', text: '27-Maharashtra' },
        { value: '29-Karnataka', text: '29-Karnataka' },
        { value: '30-Goa', text: '30-Goa' },
        { value: '31-Lakshdweep', text: '31-Lakshdweep' },
        { value: '32-Kerala', text: '32-Kerala' },
        { value: '33-Tamil Nadu', text: '33-Tamil Nadu' },
        { value: '34-Puducherry', text: '34-Puducherry' },
        { value: '35-Andaman & Nicobar Islands', text: '35-Andaman & Nicobar Islands' },
        { value: '36-Telangana', text: '36-Telangana' },
        { value: '37-Andhra Pradesh', text: '37-Andhra Pradesh' },
        { value: '38-Ladakh', text: '38-Ladakh' },
        { value: '97-Other Territory', text: '97-Other Territory' }
    ],
    applicable_of_tax_options: [
        { text: 'None', value: '0.00' },
        { text: '65.00', value: '65.00' }
    ],
    note_type_options: [
        { text: 'Debit Note', value: 'D' },
        { text: 'Credit Note', value: 'C' }
    ],
    diff_tax_rate_leased_cars: [{ text: 'None', value: '0.00' }],
    ur_type_options: [
        { text: 'B2CL', value: 'B2CL' },
        { text: 'EXPWP', value: 'EXPWP' },
        { text: 'EXPWOP', value: 'EXPWOP' }
    ],
    gstr1_option_data: [
        { text: 'B2B', value: '1' },
        { text: 'B2CS', value: '2' },
        { text: 'B2C LARGE', value: '3' },
        { text: 'EXPORT', value: '4' },
        { text: 'CDNR', value: '5' },
        { text: 'CDNUR', value: '6' },
        { text: 'Advanced Received', value: '7' }
    ],
    iff_option_data: [
        { text: 'B2B', value: '1' },
        { text: 'CDNR', value: '2' }
    ],
    gstr1_amedment_option_data: [
        { text: 'B2B Amendment', value: '1' },
        { text: 'B2CS Amendment', value: '2' },
        { text: 'B2C LARGE Amendment', value: '3' },
        { text: 'EXPORT Amendment', value: '4' },
        { text: 'CDNR Amendment', value: '5' },
        { text: 'CDNUR Amendment', value: '6' },
        { text: 'Advanced Received Amendment', value: '7' }
    ],
    iff_amedment_option_data: [
        { text: 'B2B Amendment', value: '1' },
        { text: 'CDNR Amendment', value: '2' }
    ],
    gstr1_unit_of_measurement_option_data: [
        { text: 'BAG-BAGS', value: 'BAG-BAGS' },
        { text: 'BAL-BALE', value: 'BAL-BALE' },
        { text: 'BDL-BUNDLES', value: 'BDL-BUNDLES' },
        { text: 'BKL-BUCKLES', value: 'BKL-BUCKLES' },
        { text: 'BOU-BILLION OF UNITS', value: 'BOU-BILLION OF UNITS' },
        { text: 'BOX-BOX', value: 'BOX-BOX' },
        { text: 'BTL-BOTTLES', value: 'BTL-BOTTLES' },
        { text: 'BUN-BUNCHES', value: 'BUN-BUNCHES' },
        { text: 'CAN-CANS', value: 'CAN-CANS' },
        { text: 'CBM-CUBIC METERS', value: 'CBM-CUBIC METERS' },
        { text: 'CCM-CUBIC CENTIMETERS', value: 'CCM-CUBIC CENTIMETERS' },
        { text: 'CMS-CENTIMETERS', value: 'CMS-CENTIMETERS' },
        { text: 'CTN-CARTONS', value: 'CTN-CARTONS' },
        { text: 'DOZ-DOZENS', value: 'DOZ-DOZENS' },
        { text: 'DRM-DRUMS', value: 'DRM-DRUMS' },
        { text: 'GGK-GREAT GROSS', value: 'GGK-GREAT GROSS' },
        { text: 'GMS-GRAMMES', value: 'GMS-GRAMMES' },
        { text: 'GRS-GROSS', value: 'GRS-GROSS' },
        { text: 'GYD-GROSS YARDS', value: 'GYD-GROSS YARDS' },
        { text: 'KGS-KILOGRAMS', value: 'KGS-KILOGRAMS' },
        { text: 'KLR-KILOLITRE', value: 'KLR-KILOLITRE' },
        { text: 'KME-KILOMETRE', value: 'KME-KILOMETRE' },
        { text: 'LTR-LITRES', value: 'LTR-LITRES' },
        { text: 'MLT-MILLILITRE', value: 'MLT-MILLILITRE' },
        { text: 'MTR-METERS', value: 'MTR-METERS' },
        { text: 'MTS-METRIC TON', value: 'MTS-METRIC TON' },
        { text: 'NOS-NUMBERS', value: 'NOS-NUMBERS' },
        { text: 'PAC-PACKS', value: 'PAC-PACKS' },
        { text: 'PCS-PIECES', value: 'PCS-PIECES' },
        { text: 'PRS-PAIRS', value: 'PRS-PAIRS' },
        { text: 'QTL-QUINTAL', value: 'QTL-QUINTAL' },
        { text: 'ROL-ROLLS', value: 'ROL-ROLLS' },
        { text: 'SET-SETS', value: 'SET-SETS' },
        { text: 'SQF-SQUARE FEET', value: 'SQF-SQUARE FEET' },
        { text: 'SQM-SQUARE METERS', value: 'SQM-SQUARE METERS' },
        { text: 'SQY-SQUARE YARDS', value: 'SQY-SQUARE YARDS' },
        { text: 'TBS-TABLETS', value: 'TBS-TABLETS' },
        { text: 'TGM-TEN GROSS', value: 'TGM-TEN GROSS' },
        { text: 'THD-THOUSANDS', value: 'THD-THOUSANDS' },
        { text: 'TON-TONNES', value: 'TON-TONNES' },
        { text: 'TUB-TUBES', value: 'TUB-TUBES' },
        { text: 'UGS-US GALLONS', value: 'UGS-US GALLONS' },
        { text: 'UNT-UNITS', value: 'UNT-UNITS' },
        { text: 'YDS-YARDS', value: 'YDS-YARDS' },
        { text: 'OTH-OTHERS', value: 'OTH-OTHERS' },
        { text: 'NA', value: 'NA' }
    ],
    reverse_charge_option: [
        { text: 'Y', value: 'Y' },
        { text: 'N', value: 'N' }
    ],
    nature_of_document_option_data: [
        { text: 'Invoices for outward supply', value: 'Invoices for outward supply' },
        { text: 'Invoices for inward supply from unregistered person', value: 'Invoices for inward supply from unregistered person' },
        { text: 'Revised Invoice', value: 'Revised Invoice' },
        { text: 'Debit Note', value: 'Debit Note' },
        { text: 'Credit Note', value: 'Credit Note' },
        { text: 'Receipt Voucher', value: 'Receipt Voucher' },
        { text: 'Payment Voucher', value: 'Payment Voucher' },
        { text: 'Refund Voucher', value: 'Refund Voucher' },
        { text: 'Delivery Challan for job work', value: 'Delivery Challan for job work' }
    ],
    original_month_option_data: [
        { text: 'JANUARY', value: 'JANUARY' },
        { text: 'FEBRUARY', value: 'FEBRUARY' },
        { text: 'MARCH', value: 'MARCH' },
        { text: 'APRIL', value: 'APRIL' },
        { text: 'MAY', value: 'MAY' },
        { text: 'JUNE', value: 'JUNE' },
        { text: 'JULY', value: 'JULY' },
        { text: 'AUGUST', value: 'AUGUST' },
        { text: 'SEPTEMBER', value: 'SEPTEMBER' },
        { text: 'OCTOBER', value: 'OCTOBER' },
        { text: 'NOVEMBER', value: 'NOVEMBER' },
        { text: 'DECEMBER', value: 'DECEMBER' }
    ],
    status_option_data: [
        { text: 'Pending', value: '3' },
        { text: 'Filed', value: '2' }
    ],
    static_months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    active_options: [
        { text: 'Active', value: '1' },
        { text: 'Inactive', value: '0' }
    ],
    status_options: [
        { text: 'Enable', value: '1' },
        { text: 'Disable', value: '0' }
    ],
    connection_status: [
        { text: 'Connected', value: '1' },
        { text: 'Not connected', value: '0' }
    ],
    orders_status: [
        { value: '1', text: 'Approved' },
        { value: '2', text: 'Packed' },
        { value: '3', text: 'Ready to Dispatch' },
        { value: '4', text: 'Shipped' },
        { value: '5', text: 'Deliverd' },
        { value: '7', text: 'Canclled' },
        { value: '6', text: 'Return' }
    ],
    channel_options: [
        { value: '1', text: 'Flipkart' },
        { value: '2', text: 'Amazon' },
        { value: '3', text: 'meesho' },
        { value: '4', text: 'Ajio' },
        { value: '5', text: 'Jio' },
        { value: '6', text: 'Myntra' },
        { value: '7', text: 'eBay' },
        { value: '8', text: 'Shopclues' },
        { value: '9', text: 'Snapdeal' },
        { value: '10', text: 'Shopee' },
        { value: '11', text: 'LimeRoad' },
        { value: '12', text: 'Shopify' }
    ],
    import_status_option: [
        { text: 'Pending', value: '0' },
        { text: 'In progress', value: '1' },
        { text: 'Success', value: '2' },
        { text: 'Partial success', value: '4' },
        { text: 'Failed', value: '3' },
        { text: 'Invalid file template', value: '5' }
    ],
    numberFilterCustomCondition: [
        { text: 'Equals', value: '3' },
        { text: 'Not equal', value: '4' }
    ]
}
export default OptionData