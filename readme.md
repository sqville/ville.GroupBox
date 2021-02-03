<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/sqville/ville.GroupBox">
    <img src="ville_GB.png" alt="Logo" width="300" height="123">
  </a>

  <h3 align="center"></h3>

  <p align="center">
    A groupbox control for the Qooxdoo JavaScript Framework
  </p>
</p>

<!-- ABOUT THE PROJECT -->
## About The Project

**ville.GroupBox** is a [Qooxdoo](https://qooxdoo.org/) control. It brings a collapsable feature to the standard GroupBox control, and is designed to function across all screen sizes. 

**Benefits**
* 
* 
* 

**Screen Shot**
<img src="ville_Clean_Form.PNG" alt="Screen shot example">


<!-- GETTING STARTED -->
## Using the Control in your Application
To use the control in your application, go into the application root directory and install the library into your project:
```sh
$ qx contrib update
$ qx contrib list
$ qx contrib install sqville/ville.GroupBox
```
to use the control as intended you must include Theme classes into your applications current theme. Include the two lines below at the top of your applications main function:
```sh
qx.Theme.include(qx.theme.manager.Appearance.getInstance().getTheme(), ville.groupbox.Appearance);
qx.Theme.include(qx.theme.manager.Decoration.getInstance().getTheme(), ville.groupbox.Decoration);
```

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/github_username/repo_name/issues) for a list of proposed features (and known issues).


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Chris Eskew - [@SQville](https://twitter.com/SQville) - email: chris.eskew@sqville.com