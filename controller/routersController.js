const { Book, User, Message } = require('../models');

const getHome = async (req, res) => {

  const query = await Book.findAll({
    limit: 4,
    order: [['createdAt', 'DESC']],
  });

  const result = query.map((u) => u.get({ plain: true }));

  res.render('home', {
    latestBooks: result,
  });
};


const getInsertBook = (req, res) => {
  res.render('insert-book');
};

const getViewMap = (req, res) => {
  res.render('mappa');
};

const getLogin = (req, res) => {
  res.render('login');
}

const getSignUp = (req, res) => {
  res.render('registration');
};

const getDashboard = async (req, res) => {

  try {

    if (res.locals.userLogged) {
      const iduser = req.session.userLogged.id;

      const query = await User.findByPk(iduser, {
        include: [
          {
            model: Book,
            as: 'books'
          },
          {
            model: Message,
            as: 'SentMessages',
            include: [
              {
                model: User,
                as: 'Recipient'
              }
            ]
          },
          {
            model: Message,
            as: 'RecipientMessages',
            include: [
              {
                model: User,
                as: 'Sender'
              }
            ],

          }

        ],
      });

      const result = query ? query.get({ plain: true }) : null;
      console.dir(result, { depth: null });
      var receiverLastName = result.lastName;
      var receiverFirstName = result.firstName;
      const recipientMessages = result.RecipientMessages;
      const sentMessages = result.SentMessages;
      const senderid = [];

      for (let index = 0; index < recipientMessages.length; index++) {
        const element = recipientMessages[index];
        //console.log(element);
        senderid.push({
                        id: element.Sender.id,                         
                        firstName: element.Sender.firstName,
                        lastName: element.Sender.lastName, 
                        message: []
                      });
      }
       const uniqueUsers = [...new Map(senderid.map(item => [item.id, item])).values()];
       //console.log(uniqueUsers); 

       for (let i = 0; i < uniqueUsers.length; i++) {
        const element1 = uniqueUsers[i];

          for (let j = 0; j < recipientMessages.length; j++ ) {
            const element2 = recipientMessages[j];
            if(element1.id == element2.senderId){
              (element1.message)
              .push({
                  id: element2.id, 
                  firstName: element2.Sender.firstName,
                  lastName: element2.Sender.lastName,
                  senderId: element2.senderId,
                  content: element2.content, 
                  createdAt: element2.createdAt
                }); 
            }
         }
        
       }

        for (let i = 0; i < uniqueUsers.length; i++) {
           const element1 = uniqueUsers[i];

           for (let j = 0; j < sentMessages.length; j++ ) {
                 const element2 = sentMessages[j];

                 if (element2.recipientId == element1.id) {
                    (element1.message)
                    .push({
                        id: element2.id, 
                        firstName: receiverFirstName ,
                        lastName: receiverLastName,
                        recipientId: element2.recipientId,
                        content: element2.content, 
                        createdAt: element2.createdAt
                      });                   
                 }

           }

        }

      uniqueUsers.forEach(users => {
        users.message.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      });
      
      //console.dir(uniqueUsers, { depth: null });
      res.render('dashboard', { userBooks: result.books, recipientMessages: uniqueUsers});

    }

  } catch (error) {
     //console.log(error);
     res.render('404');
  }

};

const getBook = async (req, res) => {

  const id = req.params.id;
  const slug = req.params.slug;

  try {

    const parseIdbook = Number(id);

    if (!Number.isInteger(parseIdbook)) {
      res.render('404');
    }

    const query = await Book.findOne(
      {
        where: {
          id: id,
          slug: slug
        },
        include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'avatar', 'description'] }]
      });

    const result = query ? query.get({ plain: true }) : null;

    return res.render('book-detail', {
      detailBook: result
    });

  } catch (error) {
    res.render('404');
  }

};

const getPageNotFound = (req, res) => {
  res.render('404');
};

const getCookiePolicy = (req, res) => {
  res.render('cookie-policy');
};

const getTermsAndConditions = (req, res) => {
  res.render('terms-and-conditions');
};

const getPrivacyPolicy = (req, res) => {
  res.render('privacy-policy');
};

const getRecoverPassword = (req, res) => {
  res.render('recover-password');
};


module.exports = {
  getHome,
  getInsertBook,
  getViewMap,
  getLogin,
  getSignUp,
  getDashboard,
  getBook,
  getPageNotFound,
  getCookiePolicy,
  getTermsAndConditions,
  getPrivacyPolicy,
  getRecoverPassword
};