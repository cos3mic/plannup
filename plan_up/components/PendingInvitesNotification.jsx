import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors.jsx';
import { useOrganizationCustom } from './OrganizationContext';

export default function PendingInvitesNotification() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { getPendingInvites, acceptInvite, declineInvite } = useOrganizationCustom();
  
  const [pendingInvites, setPendingInvites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedInvite, setSelectedInvite] = useState(null);

  useEffect(() => {
    loadPendingInvites();
  }, []);

  const loadPendingInvites = () => {
    const invites = getPendingInvites();
    setPendingInvites(invites);
  };

  const handleInviteAction = async (invite, action) => {
    setSelectedInvite(invite);
    setActionType(action);
    setIsLoading(true);

    try {
      let result;
      if (action === 'accept') {
        result = await acceptInvite(invite.id, invite.orgId);
      } else if (action === 'decline') {
        result = await declineInvite(invite.id, invite.orgId);
      }

      if (result?.success) {
        Alert.alert(
          'Success',
          `Invite ${action === 'accept' ? 'accepted' : 'declined'} successfully`,
          [{ text: 'OK', onPress: loadPendingInvites }]
        );
      } else {
        Alert.alert('Error', `Failed to ${action} invite. Please try again.`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to ${action} invite. Please try again.`);
    } finally {
      setIsLoading(false);
      setActionType(null);
      setSelectedInvite(null);
    }
  };

  const handleAcceptInvite = (invite) => {
    Alert.alert(
      'Accept Invite',
      `Accept invitation to join "${invite.orgName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Accept', onPress: () => handleInviteAction(invite, 'accept') }
      ]
    );
  };

  const handleDeclineInvite = (invite) => {
    Alert.alert(
      'Decline Invite',
      `Decline invitation to join "${invite.orgName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Decline', style: 'destructive', onPress: () => handleInviteAction(invite, 'decline') }
      ]
    );
  };

  if (pendingInvites.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.coral }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail" size={20} color="#fff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>You have pending invites</Text>
          <Text style={styles.subtitle}>
            {pendingInvites.length} organization invite{pendingInvites.length !== 1 ? 's' : ''} waiting for your response
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => {
            Alert.alert(
              'Pending Invites',
              pendingInvites.map(invite => 
                `${invite.orgName} (invited by ${invite.invitedBy})`
              ).join('\n\n'),
              [
                { text: 'View All', onPress: () => {
                  // Here you could navigate to a full invites screen
                  console.log('Navigate to invites screen');
                }},
                { text: 'Cancel', style: 'cancel' }
              ]
            );
          }}
        >
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.actionsContainer}>
        {pendingInvites.slice(0, 2).map((invite, index) => (
          <View key={invite.id} style={styles.inviteItem}>
            <View style={styles.inviteInfo}>
              <Text style={styles.inviteOrgName}>{invite.orgName}</Text>
              <Text style={styles.inviteBy}>Invited by {invite.invitedBy}</Text>
            </View>
            <View style={styles.inviteActions}>
              <TouchableOpacity
                style={[styles.acceptButton, { 
                  backgroundColor: isLoading && selectedInvite?.id === invite.id && actionType === 'accept' 
                    ? colors.textSecondary 
                    : '#4CAF50' 
                }]}
                onPress={() => handleAcceptInvite(invite)}
                disabled={isLoading && selectedInvite?.id === invite.id && actionType === 'accept'}
              >
                {isLoading && selectedInvite?.id === invite.id && actionType === 'accept' ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>Accept</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.declineButton, { 
                  backgroundColor: isLoading && selectedInvite?.id === invite.id && actionType === 'decline' 
                    ? colors.textSecondary 
                    : 'transparent' 
                }]}
                onPress={() => handleDeclineInvite(invite)}
                disabled={isLoading && selectedInvite?.id === invite.id && actionType === 'decline'}
              >
                {isLoading && selectedInvite?.id === invite.id && actionType === 'decline' ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="close" size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>Decline</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {pendingInvites.length > 2 && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => {
              Alert.alert(
                'All Pending Invites',
                pendingInvites.map(invite => 
                  `${invite.orgName} (invited by ${invite.invitedBy})`
                ).join('\n\n'),
                [
                  { text: 'OK', style: 'default' }
                ]
              );
            }}
          >
            <Text style={styles.viewAllText}>
              View all {pendingInvites.length} invites
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  viewButton: {
    padding: 8,
  },
  actionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
  },
  inviteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteOrgName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  inviteBy: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  inviteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  declineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
    gap: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
}); 