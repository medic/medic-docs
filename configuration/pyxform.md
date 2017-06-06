## PyxForm

- [Pyxform](https://github.com/SEL-Columbia/pyxform) is a Python library that makes writing XForms for ODK Collect and enketo easy by converting XLS/XLSX spreadsheets into XForms. 

### Prerequisites
- Python
- [Xlrd](https://pypi.python.org/pypi/xlrd)

- To install xlrd.On Ubuntu, use these commands
```
easy_install pip
pip install xlrd
```

- Installing PyXform from Github:
```
pip install -e git+https://github.com/GITHUB USER NAME GOES HERE/pyxform.git@master#egg=pyxform
```

- To check whether the install worked
```
pip install nose==1.0.0
cd path/to/pyxform
nosetests
```

- Converting  XLSX to XFORM(xml format)

```
python path/to/pyxform/xls2xform.py path_to_XLSForm output_path
```

- For example:

```
python /path/to/pyxform/xls2xform.py myExcel.xlsx myOutput.xml
```